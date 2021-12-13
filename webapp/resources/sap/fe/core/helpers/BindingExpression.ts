import {
	AndAnnotationExpression,
	AndConditionalExpression,
	ConditionalCheckOrValue,
	EntityType,
	EqAnnotationExpression,
	EqConditionalExpression,
	GeAnnotationExpression,
	GeConditionalExpression,
	GtAnnotationExpression,
	GtConditionalExpression,
	IfAnnotationExpression,
	IfAnnotationExpressionValue,
	LeAnnotationExpression,
	LeConditionalExpression,
	LtAnnotationExpression,
	LtConditionalExpression,
	NeAnnotationExpression,
	NeConditionalExpression,
	NotAnnotationExpression,
	NotConditionalExpression,
	OrAnnotationExpression,
	OrConditionalExpression,
	PathConditionExpression,
	PropertyAnnotationValue
} from "@sap-ux/vocabularies-types";
import { ApplyAnnotationExpression, PathAnnotationExpression } from "@sap-ux/vocabularies-types/types/Edm";
import { EntitySet } from "@sap-ux/vocabularies-types/dist/Converter";
import { resolveEnumValue } from "./AnnotationEnum";

type PrimitiveType = string | number | boolean | object | null | undefined;

type BaseExpression<T> = {
	_type: string;
};

export type ConstantExpression<T> = BaseExpression<T> & {
	_type: "Constant";
	value: T;
};

type SetOperator = "&&" | "||";
export type SetExpression = BaseExpression<boolean> & {
	_type: "Set";
	operator: SetOperator;
	operands: Expression<boolean>[];
};

export type NotExpression = BaseExpression<boolean> & {
	_type: "Not";
	operand: Expression<boolean>;
};

export type TruthyExpression = BaseExpression<boolean> & {
	_type: "Truthy";
	operand: Expression<string>;
};

export type ReferenceExpression = BaseExpression<object> & {
	_type: "Ref";
	ref: string | null;
};

export type FormatterExpression<T> = BaseExpression<T> & {
	_type: "Formatter";
	fn: string;
	parameters: Expression<any>[];
};

export type ComplexTypeExpression<T> = BaseExpression<T> & {
	_type: "ComplexType";
	type: string;
	formatOptions: object;
	parameters: object;
	bindingParameters: Expression<any>[];
};

export type FunctionExpression<T> = BaseExpression<T> & {
	_type: "Function";
	obj?: Expression<object>;
	fn: string;
	parameters: Expression<any>[];
};

export type ConcatExpression = BaseExpression<string> & {
	_type: "Concat";
	expressions: Expression<string>[];
};

export type UnresolveableBindingExpression = BaseExpression<string> & {
	_type: "Unresolveable";
};

/**
 * @typedef BindingExpressionExpression
 */
export type BindingExpressionExpression<T> = BaseExpression<T> & {
	_type: "Binding";
	modelName?: string;
	path: string;
	targetEntitySet?: EntitySet;
	type?: string;
	constraints?: any;
	parameters?: any;
	targetType?: string;
	formatOptions?: any;
};

export type DefaultBindingExpressionExpression<T> = BaseExpression<T> & {
	_type: "DefaultBinding";
	modelName?: string;
	path: string;
	type?: string;
	constraints?: object;
	parameters?: any;
	targetType?: string;
	formatOptions?: object;
};

export type EmbeddedBindingExpression<T> = BaseExpression<T> & {
	_type: "EmbeddedBinding";
	value: string;
};

export type EmbeddedExpressionBindingExpression<T> = BaseExpression<T> & {
	_type: "EmbeddedExpressionBinding";
	value: string;
};

type ComparisonOperator = "===" | "!==" | ">=" | ">" | "<=" | "<";
export type ComparisonExpression = BaseExpression<boolean> & {
	_type: "Comparison";
	operator: ComparisonOperator;
	operand1: Expression<any>;
	operand2: Expression<any>;
};

export type IfElseExpression<T> = BaseExpression<T> & {
	_type: "IfElse";
	condition: Expression<boolean>;
	onTrue: Expression<T>;
	onFalse: Expression<T>;
};

/**
 * An expression that evaluates to type T.
 *
 * @typedef Expression
 */
export type Expression<T> =
	| UnresolveableBindingExpression
	| ConstantExpression<T>
	| SetExpression
	| NotExpression
	| TruthyExpression
	| ConcatExpression
	| BindingExpressionExpression<T>
	| EmbeddedBindingExpression<T>
	| EmbeddedExpressionBindingExpression<T>
	| DefaultBindingExpressionExpression<T>
	| ComparisonExpression
	| IfElseExpression<T>
	| FormatterExpression<T>
	| ComplexTypeExpression<T>
	| ReferenceExpression
	| FunctionExpression<T>;

/**
 * An expression that evaluates to type T, or a constant value of type T
 */
export type ExpressionOrPrimitive<T extends PrimitiveType> = Expression<T> | T;

export const unresolveableExpression: UnresolveableBindingExpression = {
	_type: "Unresolveable"
};

function escapeXmlAttribute(inputString: string) {
	return inputString.replace(/[']/g, function(c: string) {
		switch (c) {
			case "'":
				return "\\'";
			default:
				return c;
		}
	});
}

export function hasUnresolveableExpression(...expressions: Expression<any>[]): boolean {
	return expressions.find(expr => expr._type === "Unresolveable") !== undefined;
}
/**
 * Check two expressions for (deep) equality.
 *
 * @param a
 * @param b
 * @returns {boolean} `true` if the two expressions are equal
 */
export function _checkExpressionsAreEqual<T>(a: Expression<T>, b: Expression<T>): boolean {
	if (a._type !== b._type) {
		return false;
	}

	switch (a._type) {
		case "Unresolveable":
			return false; // Unresolveable is never equal to anything even itself
		case "Constant":
		case "EmbeddedBinding":
		case "EmbeddedExpressionBinding":
			return a.value === (b as ConstantExpression<T>).value;

		case "Not":
			return _checkExpressionsAreEqual(a.operand, (b as NotExpression).operand);
		case "Truthy":
			return _checkExpressionsAreEqual(a.operand, (b as TruthyExpression).operand);
		case "Set":
			return (
				a.operator === (b as SetExpression).operator &&
				a.operands.length === (b as SetExpression).operands.length &&
				a.operands.every(expression =>
					(b as SetExpression).operands.some(otherExpression => _checkExpressionsAreEqual(expression, otherExpression))
				)
			);

		case "IfElse":
			return (
				_checkExpressionsAreEqual(a.condition, (b as IfElseExpression<T>).condition) &&
				_checkExpressionsAreEqual(a.onTrue, (b as IfElseExpression<T>).onTrue) &&
				_checkExpressionsAreEqual(a.onFalse, (b as IfElseExpression<T>).onFalse)
			);

		case "Comparison":
			return (
				a.operator == (b as ComparisonExpression).operator &&
				_checkExpressionsAreEqual(a.operand1, (b as ComparisonExpression).operand1) &&
				_checkExpressionsAreEqual(a.operand2, (b as ComparisonExpression).operand2)
			);

		case "Concat":
			const aExpressions = a.expressions;
			const bExpressions = (b as ConcatExpression).expressions;
			if (aExpressions.length !== bExpressions.length) {
				return false;
			}
			return aExpressions.every((expression, index) => {
				return _checkExpressionsAreEqual(expression, bExpressions[index]);
			});

		case "Binding":
			return (
				a.modelName === (b as BindingExpressionExpression<T>).modelName &&
				a.path === (b as BindingExpressionExpression<T>).path &&
				a.targetEntitySet === (b as BindingExpressionExpression<T>).targetEntitySet
			);

		case "DefaultBinding":
			return (
				a.modelName === (b as DefaultBindingExpressionExpression<T>).modelName &&
				a.path === (b as DefaultBindingExpressionExpression<T>).path
			);

		case "Formatter":
			return (
				a.fn === (b as FormatterExpression<T>).fn &&
				a.parameters.length === (b as FormatterExpression<T>).parameters.length &&
				a.parameters.every((value, index) => _checkExpressionsAreEqual((b as FormatterExpression<T>).parameters[index], value))
			);
		case "ComplexType":
			return (
				a.type === (b as ComplexTypeExpression<T>).type &&
				a.bindingParameters.length === (b as ComplexTypeExpression<T>).bindingParameters.length &&
				a.bindingParameters.every((value, index) =>
					_checkExpressionsAreEqual((b as ComplexTypeExpression<T>).bindingParameters[index], value)
				)
			);
		case "Function":
			const otherFunction = b as FunctionExpression<T>;
			if (a.obj === undefined || otherFunction.obj === undefined) {
				return a.obj === otherFunction;
			}

			return (
				a.fn === otherFunction.fn &&
				_checkExpressionsAreEqual(a.obj, otherFunction.obj) &&
				a.parameters.length === otherFunction.parameters.length &&
				a.parameters.every((value, index) => _checkExpressionsAreEqual(otherFunction.parameters[index], value))
			);

		case "Ref":
			return a.ref === (b as ReferenceExpression).ref;
	}
}

/**
 * Converts a nested SetExpression by inlining operands of type SetExpression with the same operator.
 *
 * @param expression The expression to flatten
 * @returns {SetExpression} A new SetExpression with the same operator
 */
function flattenSetExpression(expression: SetExpression): SetExpression {
	return expression.operands.reduce(
		(result: SetExpression, operand) => {
			const candidatesForFlattening =
				operand._type === "Set" && operand.operator === expression.operator ? operand.operands : [operand];
			candidatesForFlattening.forEach(candidate => {
				if (result.operands.every(e => !_checkExpressionsAreEqual(e, candidate))) {
					result.operands.push(candidate);
				}
			});
			return result;
		},
		{ _type: "Set", operator: expression.operator, operands: [] }
	);
}

/**
 * Detects whether an array of boolean expressions contains an expression and its negation.
 *
 * @param expressions Array of expressions
 * @returns {boolean} `true` if the set of expressions contains an expression and its negation
 */
function hasOppositeExpressions(expressions: Expression<boolean>[]): boolean {
	if (expressions.length < 2) {
		return false;
	}

	let i = expressions.length;
	while (i--) {
		const expression = expressions[i];
		const negatedExpression = not(expression);
		for (let j = 0; j < i; j++) {
			if (_checkExpressionsAreEqual(expressions[j], negatedExpression)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Logical `and` expression.
 *
 * The expression is simplified to false if this can be decided statically (that is, if one operand is a constant
 * false or if the expression contains an operand and its negation).
 *
 * @param operands Expressions to connect by `and`
 * @returns {Expression<boolean>} Expression evaluating to boolean
 */
export function and(...operands: ExpressionOrPrimitive<boolean>[]): Expression<boolean> {
	const expressions = flattenSetExpression({
		_type: "Set",
		operator: "&&",
		operands: operands.map(wrapPrimitive)
	}).operands;

	if (hasUnresolveableExpression(...expressions)) {
		return unresolveableExpression;
	}
	let isStaticFalse: boolean = false;
	const nonTrivialExpression = expressions.filter(expression => {
		if (isConstant(expression) && !expression.value) {
			isStaticFalse = true;
		}
		return !isConstant(expression);
	});
	if (isStaticFalse) {
		return constant(false);
	} else if (nonTrivialExpression.length === 0) {
		// Resolve the constant then
		const isValid = expressions.reduce((isValid, expression) => {
			return isValid && isConstant(expression) && expression.value;
		}, true);
		return constant(isValid);
	} else if (nonTrivialExpression.length === 1) {
		return nonTrivialExpression[0];
	} else if (hasOppositeExpressions(nonTrivialExpression)) {
		return constant(false);
	} else {
		return {
			_type: "Set",
			operator: "&&",
			operands: nonTrivialExpression
		};
	}
}

/**
 * Logical `or` expression.
 *
 * The expression is simplified to true if this can be decided statically (that is, if one operand is a constant
 * true or if the expression contains an operand and its negation).
 *
 * @param operands Expressions to connect by `or`
 * @returns {Expression<boolean>} Expression evaluating to boolean
 */
export function or(...operands: ExpressionOrPrimitive<boolean>[]): Expression<boolean> {
	const expressions = flattenSetExpression({
		_type: "Set",
		operator: "||",
		operands: operands.map(wrapPrimitive)
	}).operands;
	if (hasUnresolveableExpression(...expressions)) {
		return unresolveableExpression;
	}
	let isStaticTrue: boolean = false;
	const nonTrivialExpression = expressions.filter(expression => {
		if (isConstant(expression) && expression.value) {
			isStaticTrue = true;
		}
		return !isConstant(expression) || expression.value;
	});
	if (isStaticTrue) {
		return constant(true);
	} else if (nonTrivialExpression.length === 0) {
		// Resolve the constant then
		const isValid = expressions.reduce((isValid, expression) => {
			return isValid && isConstant(expression) && expression.value;
		}, true);
		return constant(isValid);
	} else if (nonTrivialExpression.length === 1) {
		return nonTrivialExpression[0];
	} else if (hasOppositeExpressions(nonTrivialExpression)) {
		return constant(true);
	} else {
		return {
			_type: "Set",
			operator: "||",
			operands: nonTrivialExpression
		};
	}
}

/**
 * Logical `not` operator.
 *
 * @param operand The expression to reverse
 * @returns {Expression<boolean>} The resulting expression that evaluates to boolean
 */
export function not(operand: ExpressionOrPrimitive<boolean>): Expression<boolean> {
	operand = wrapPrimitive(operand);
	if (hasUnresolveableExpression(operand)) {
		return unresolveableExpression;
	} else if (isConstant(operand)) {
		return constant(!operand.value);
	} else if (
		typeof operand === "object" &&
		operand._type === "Set" &&
		operand.operator === "||" &&
		operand.operands.every(expression => isConstant(expression) || isComparison(expression))
	) {
		return and(...operand.operands.map(expression => not(expression)));
	} else if (
		typeof operand === "object" &&
		operand._type === "Set" &&
		operand.operator === "&&" &&
		operand.operands.every(expression => isConstant(expression) || isComparison(expression))
	) {
		return or(...operand.operands.map(expression => not(expression)));
	} else if (isComparison(operand)) {
		// Create the reverse comparison
		switch (operand.operator) {
			case "!==":
				return equal(operand.operand1, operand.operand2);
			case "<":
				return greaterOrEqual(operand.operand1, operand.operand2);
			case "<=":
				return greaterThan(operand.operand1, operand.operand2);
			case "===":
				return notEqual(operand.operand1, operand.operand2);
			case ">":
				return lessOrEqual(operand.operand1, operand.operand2);
			case ">=":
				return lessThan(operand.operand1, operand.operand2);
		}
	} else if (operand._type === "Not") {
		return operand.operand;
	} else {
		return {
			_type: "Not",
			operand: operand
		};
	}
}

/**
 * Evaluates whether a binding expression is equal to true with a loose equality.
 *
 * @param operand The expression to check
 * @returns {Expression<boolean>} The resulting expression that evaluates to boolean
 */
export function isTruthy(operand: Expression<string>): Expression<boolean> {
	if (isConstant(operand)) {
		return constant(!!operand.value);
	} else {
		return {
			_type: "Truthy",
			operand: operand
		};
	}
}

/**
 * Creates a binding expression that will be evaluated by the corresponding model.
 *
 * @template TargetType
 * @param path The path on the model
 * @param [modelName] The name of the model
 * @param [visitedNavigationPaths] The paths from the root entitySet
 * @param [pathVisitor] A function to modify the resulting path
 * @returns {BindingExpressionExpression<TargetType>} The default binding expression
 */
export function bindingExpression<TargetType extends PrimitiveType>(
	path: string | undefined,
	modelName?: string,
	visitedNavigationPaths: string[] = [],
	pathVisitor?: Function
): BindingExpressionExpression<TargetType> | UnresolveableBindingExpression {
	if (path === undefined) {
		return unresolveableExpression;
	}
	let targetPath;
	if (pathVisitor) {
		targetPath = pathVisitor(path);
		if (targetPath === undefined) {
			return unresolveableExpression;
		}
	} else {
		const localPath = visitedNavigationPaths.concat();
		localPath.push(path);
		targetPath = localPath.join("/");
	}
	return {
		_type: "Binding",
		modelName: modelName,
		path: targetPath
	};
}

type PlainExpressionObject = { [index: string]: Expression<any> };

/**
 * Creates a constant expression based on a primitive value.
 *
 * @template T
 * @param value The constant to wrap in an expression
 * @returns {ConstantExpression<T>} The constant expression
 */
export function constant<T extends PrimitiveType>(value: T): ConstantExpression<T> {
	let constantValue: T;

	if (typeof value === "object" && value !== null && value !== undefined) {
		if (Array.isArray(value)) {
			constantValue = value.map(wrapPrimitive) as T;
		} else if (isPrimitiveObject(value as object)) {
			constantValue = value.valueOf() as T;
		} else {
			const val = value as { [name: string]: ExpressionOrPrimitive<any> };
			const obj = Object.keys(val).reduce((obj, key) => {
				const value = wrapPrimitive(val[key]);
				if (value._type !== "Constant" || value.value !== undefined) {
					obj[key] = value;
				}
				return obj;
			}, {} as PlainExpressionObject);

			constantValue = obj as T;
		}
	} else {
		constantValue = value;
	}

	return { _type: "Constant", value: constantValue };
}

type EvaluationType = "boolean";
export function resolveBindingString<T extends PrimitiveType>(
	value: string | boolean | number,
	targetType?: EvaluationType
): ConstantExpression<T> | EmbeddedBindingExpression<T> | EmbeddedExpressionBindingExpression<T> {
	if (value !== undefined && typeof value === "string" && value.startsWith("{")) {
		if (value.startsWith("{=")) {
			// Expression binding, we can just remove the outer binding things
			return {
				_type: "EmbeddedExpressionBinding",
				value: value
			};
		} else {
			return {
				_type: "EmbeddedBinding",
				value: value
			};
		}
	} else {
		switch (targetType) {
			case "boolean":
				if (typeof value === "string" && (value === "true" || value === "false")) {
					return constant(value === "true") as ConstantExpression<T>;
				}
				return constant(value) as ConstantExpression<T>;
			default:
				return constant(value) as ConstantExpression<T>;
		}
	}
}

/**
 * A named reference.
 *
 * @see fn
 *
 * @param ref Reference
 * @returns {ReferenceExpression} The object reference binding part
 */
export function ref(ref: string | null): ReferenceExpression {
	return { _type: "Ref", ref };
}

/**
 * Determine whether the type is an expression.
 *
 * Every object having a property named `_type` of some value is considered an expression, even if there is actually
 * no such expression type supported.
 *
 * @param something Type to check
 * @returns {boolean} `true` if the type is considered to be an expression
 */
function isExpression<T extends PrimitiveType>(something: ExpressionOrPrimitive<T>): something is Expression<T> {
	return something !== null && typeof something === "object" && (something as BaseExpression<T>)._type !== undefined;
}

/**
 * Wrap a primitive into a constant expression if it is not already an expression.
 *
 * @template T
 * @param something The object to wrap in a Constant expression
 * @returns {Expression<T>} Either the original object or the wrapped one depending on the case
 */
function wrapPrimitive<T extends PrimitiveType>(something: ExpressionOrPrimitive<T>): Expression<T> {
	if (isExpression(something)) {
		return something;
	}

	return constant(something);
}

/**
 * Checks if the expression or value provided is constant or not.
 *
 * @template T The target type
 * @param  maybeConstant The expression or primitive value that is to be checked
 * @returns {boolean} `true` if it is constant
 */
export function isConstant<T extends PrimitiveType>(maybeConstant: ExpressionOrPrimitive<T>): maybeConstant is ConstantExpression<T> {
	return typeof maybeConstant !== "object" || (maybeConstant as BaseExpression<T>)._type === "Constant";
}

/**
 * Checks if the expression or value provided is binding or not.
 *
 * @template T The target type
 * @param  maybeBinding The expression or primitive value that is to be checked
 * @returns {boolean} `true` if it is binding
 */
export function isBinding<T extends PrimitiveType>(maybeBinding: ExpressionOrPrimitive<T>): maybeBinding is BindingExpressionExpression<T> {
	return typeof maybeBinding === "object" && (maybeBinding as BaseExpression<T>)._type === "Binding";
}

/**
 * Checks if the expression provided is a comparison or not.
 *
 * @template T The target type
 * @param expression The expression
 * @returns {boolean} `true` if the expression is a ComparisonExpression
 */
function isComparison<T extends PrimitiveType>(expression: Expression<T>): expression is ComparisonExpression {
	return expression._type === "Comparison";
}

type ComplexAnnotationExpression<P> =
	| PathAnnotationExpression<P>
	| ApplyAnnotationExpression<P>
	| IfAnnotationExpression<P>
	| OrAnnotationExpression<P>
	| AndAnnotationExpression<P>
	| NeAnnotationExpression<P>
	| EqAnnotationExpression<P>
	| NotAnnotationExpression<P>
	| GtAnnotationExpression<P>
	| GeAnnotationExpression<P>
	| LeAnnotationExpression<P>
	| LtAnnotationExpression<P>;

function isPrimitiveObject(objectType: object): boolean {
	switch (objectType.constructor.name) {
		case "String":
		case "Number":
		case "Boolean":
			return true;
		default:
			return false;
	}
}
/**
 * Check if the passed annotation expression is a ComplexAnnotationExpression.
 *
 * @template T The target type
 * @param  annotationExpression The annotation expression to evaluate
 * @returns {boolean} `true` if the object is a {ComplexAnnotationExpression}
 */
function isComplexAnnotationExpression<T>(
	annotationExpression: PropertyAnnotationValue<T>
): annotationExpression is ComplexAnnotationExpression<T> {
	return typeof annotationExpression === "object" && !isPrimitiveObject(annotationExpression as object);
}

/**
 * Generate the corresponding expression for a given annotation expression.
 *
 * @template T The target type
 * @param annotationExpression The source annotation expression
 * @param visitedNavigationPaths The path from the root entity set
 * @param defaultValue Default value if the annotationExpression is undefined
 * @param pathVisitor A function to modify the resulting path
 * @returns {Expression<T>} The expression equivalent to that annotation expression
 */
export function annotationExpression<T extends PrimitiveType>(
	annotationExpression: PropertyAnnotationValue<T>,
	visitedNavigationPaths: string[] = [],
	defaultValue?: ExpressionOrPrimitive<T>,
	pathVisitor?: Function
): Expression<T> {
	if (annotationExpression === undefined) {
		return wrapPrimitive(defaultValue as T);
	}
	if (!isComplexAnnotationExpression(annotationExpression)) {
		return constant(annotationExpression);
	} else {
		switch (annotationExpression.type) {
			case "Path":
				return bindingExpression(annotationExpression.path, undefined, visitedNavigationPaths, pathVisitor);
			case "If":
				return annotationIfExpression(annotationExpression.If, visitedNavigationPaths, pathVisitor);
			case "Not":
				return not(parseAnnotationCondition(annotationExpression.Not, visitedNavigationPaths, pathVisitor)) as Expression<T>;
			case "Eq":
				return equal(
					parseAnnotationCondition(annotationExpression.Eq[0], visitedNavigationPaths, pathVisitor),
					parseAnnotationCondition(annotationExpression.Eq[1], visitedNavigationPaths, pathVisitor)
				) as Expression<T>;
			case "Ne":
				return notEqual(
					parseAnnotationCondition(annotationExpression.Ne[0], visitedNavigationPaths, pathVisitor),
					parseAnnotationCondition(annotationExpression.Ne[1], visitedNavigationPaths, pathVisitor)
				) as Expression<T>;
			case "Gt":
				return greaterThan(
					parseAnnotationCondition(annotationExpression.Gt[0], visitedNavigationPaths, pathVisitor),
					parseAnnotationCondition(annotationExpression.Gt[1], visitedNavigationPaths, pathVisitor)
				) as Expression<T>;
			case "Ge":
				return greaterOrEqual(
					parseAnnotationCondition(annotationExpression.Ge[0], visitedNavigationPaths, pathVisitor),
					parseAnnotationCondition(annotationExpression.Ge[1], visitedNavigationPaths, pathVisitor)
				) as Expression<T>;
			case "Lt":
				return lessThan(
					parseAnnotationCondition(annotationExpression.Lt[0], visitedNavigationPaths, pathVisitor),
					parseAnnotationCondition(annotationExpression.Lt[1], visitedNavigationPaths, pathVisitor)
				) as Expression<T>;
			case "Le":
				return lessOrEqual(
					parseAnnotationCondition(annotationExpression.Le[0], visitedNavigationPaths, pathVisitor),
					parseAnnotationCondition(annotationExpression.Le[1], visitedNavigationPaths, pathVisitor)
				) as Expression<T>;
			case "Or":
				return or(
					...(annotationExpression.Or.map(function(orCondition) {
						return parseAnnotationCondition(orCondition, visitedNavigationPaths, pathVisitor);
					}) as Expression<boolean>[])
				) as Expression<T>;
			case "And":
				return and(
					...(annotationExpression.And.map(function(andCondition) {
						return parseAnnotationCondition(andCondition, visitedNavigationPaths, pathVisitor);
					}) as Expression<boolean>[])
				) as Expression<T>;
			case "Apply":
				return annotationApplyExpression(
					annotationExpression as ApplyAnnotationExpression<string>,
					visitedNavigationPaths,
					pathVisitor
				) as Expression<T>;
		}
	}
}

/**
 * Parse the annotation condition into an expression.
 *
 * @template T The target type
 * @param annotationValue The condition or value from the annotation
 * @param visitedNavigationPaths The path from the root entity set
 * @param pathVisitor A function to modify the resulting path
 * @returns {Expression<T>} An equivalent expression
 */
function parseAnnotationCondition<T extends PrimitiveType>(
	annotationValue: ConditionalCheckOrValue,
	visitedNavigationPaths: string[] = [],
	pathVisitor?: Function
): Expression<T> {
	if (annotationValue === null || typeof annotationValue !== "object") {
		return constant(annotationValue as T);
	} else if (annotationValue.hasOwnProperty("$Or")) {
		return or(
			...(((annotationValue as OrConditionalExpression).$Or.map(function(orCondition) {
				return parseAnnotationCondition(orCondition, visitedNavigationPaths, pathVisitor);
			}) as unknown) as Expression<boolean>[])
		) as Expression<T>;
	} else if (annotationValue.hasOwnProperty("$And")) {
		return and(
			...(((annotationValue as AndConditionalExpression).$And.map(function(andCondition) {
				return parseAnnotationCondition(andCondition, visitedNavigationPaths, pathVisitor);
			}) as unknown) as Expression<boolean>[])
		) as Expression<T>;
	} else if (annotationValue.hasOwnProperty("$Not")) {
		return not(
			parseAnnotationCondition((annotationValue as NotConditionalExpression).$Not[0], visitedNavigationPaths, pathVisitor)
		) as Expression<T>;
	} else if (annotationValue.hasOwnProperty("$Eq")) {
		return equal(
			parseAnnotationCondition((annotationValue as EqConditionalExpression).$Eq[0], visitedNavigationPaths, pathVisitor),
			parseAnnotationCondition((annotationValue as EqConditionalExpression).$Eq[1], visitedNavigationPaths, pathVisitor)
		) as Expression<T>;
	} else if (annotationValue.hasOwnProperty("$Ne")) {
		return notEqual(
			parseAnnotationCondition((annotationValue as NeConditionalExpression).$Ne[0], visitedNavigationPaths, pathVisitor),
			parseAnnotationCondition((annotationValue as NeConditionalExpression).$Ne[1], visitedNavigationPaths, pathVisitor)
		) as Expression<T>;
	} else if (annotationValue.hasOwnProperty("$Gt")) {
		return greaterThan(
			parseAnnotationCondition((annotationValue as GtConditionalExpression).$Gt[0], visitedNavigationPaths, pathVisitor),
			parseAnnotationCondition((annotationValue as GtConditionalExpression).$Gt[1], visitedNavigationPaths, pathVisitor)
		) as Expression<T>;
	} else if (annotationValue.hasOwnProperty("$Ge")) {
		return greaterOrEqual(
			parseAnnotationCondition((annotationValue as GeConditionalExpression).$Ge[0], visitedNavigationPaths, pathVisitor),
			parseAnnotationCondition((annotationValue as GeConditionalExpression).$Ge[1], visitedNavigationPaths, pathVisitor)
		) as Expression<T>;
	} else if (annotationValue.hasOwnProperty("$Lt")) {
		return lessThan(
			parseAnnotationCondition((annotationValue as LtConditionalExpression).$Lt[0], visitedNavigationPaths, pathVisitor),
			parseAnnotationCondition((annotationValue as LtConditionalExpression).$Lt[1], visitedNavigationPaths, pathVisitor)
		) as Expression<T>;
	} else if (annotationValue.hasOwnProperty("$Le")) {
		return lessOrEqual(
			parseAnnotationCondition((annotationValue as LeConditionalExpression).$Le[0], visitedNavigationPaths, pathVisitor),
			parseAnnotationCondition((annotationValue as LeConditionalExpression).$Le[1], visitedNavigationPaths, pathVisitor)
		) as Expression<T>;
	} else if (annotationValue.hasOwnProperty("$Path")) {
		return bindingExpression((annotationValue as PathConditionExpression<T>).$Path, undefined, visitedNavigationPaths, pathVisitor);
	} else if (annotationValue.hasOwnProperty("$Apply")) {
		return annotationExpression(
			{
				type: "Apply",
				Function: (annotationValue as any).$Function,
				Apply: (annotationValue as any).$Apply
			} as T,
			visitedNavigationPaths,
			undefined,
			pathVisitor
		);
	} else if (annotationValue.hasOwnProperty("$If")) {
		return annotationExpression(
			{
				type: "If",
				If: (annotationValue as any).$If
			} as T,
			visitedNavigationPaths,
			undefined,
			pathVisitor
		);
	} else if (annotationValue.hasOwnProperty("$EnumMember")) {
		return constant(resolveEnumValue((annotationValue as any).$EnumMember) as T);
	} else {
		return constant(false as T);
	}
}

/**
 * Process the {IfAnnotationExpressionValue} into an expression.
 *
 * @template T The target type
 * @param annotationIfExpression An If expression returning the type T
 * @param visitedNavigationPaths The path from the root entity set
 * @param pathVisitor A function to modify the resulting path
 * @returns {Expression<T>} The equivalent ifElse expression
 */
export function annotationIfExpression<T extends PrimitiveType>(
	annotationIfExpression: IfAnnotationExpressionValue<T>,
	visitedNavigationPaths: string[] = [],
	pathVisitor?: Function
): Expression<T> {
	return ifElse(
		parseAnnotationCondition(annotationIfExpression[0], visitedNavigationPaths, pathVisitor),
		parseAnnotationCondition(annotationIfExpression[1] as any, visitedNavigationPaths, pathVisitor),
		parseAnnotationCondition(annotationIfExpression[2] as any, visitedNavigationPaths, pathVisitor)
	);
}

export function annotationApplyExpression(
	annotationApplyExpression: ApplyAnnotationExpression<string>,
	visitedNavigationPaths: string[] = [],
	pathVisitor?: Function
): Expression<string> {
	switch (annotationApplyExpression.Function) {
		case "odata.concat":
			return concat(
				...annotationApplyExpression.Apply.map((applyParam: any) => {
					let applyParamConverted = applyParam;
					if (applyParam.hasOwnProperty("$Path")) {
						applyParamConverted = {
							type: "Path",
							path: applyParam.$Path
						};
					} else if (applyParam.hasOwnProperty("$If")) {
						applyParamConverted = {
							type: "If",
							If: applyParam.$If
						};
					} else if (applyParam.hasOwnProperty("$Apply")) {
						applyParamConverted = {
							type: "Apply",
							Function: applyParam.$Function,
							Apply: applyParam.$Apply
						};
					}
					return annotationExpression(applyParamConverted, visitedNavigationPaths, undefined, pathVisitor);
				})
			);
			break;
	}
}

/**
 * Generic helper for the comparison operations (equal, notEqual, ...).
 *
 * @template T The target type
 * @param operator The operator to apply
 * @param leftOperand The operand on the left side of the operator
 * @param rightOperand The operand on the right side of the operator
 * @returns {Expression<boolean>} An expression representing the comparison
 */
function comparison<T extends PrimitiveType>(
	operator: ComparisonOperator,
	leftOperand: ExpressionOrPrimitive<T>,
	rightOperand: ExpressionOrPrimitive<T>
): Expression<boolean> {
	const leftExpression = wrapPrimitive(leftOperand);
	const rightExpression = wrapPrimitive(rightOperand);
	if (hasUnresolveableExpression(leftExpression, rightExpression)) {
		return unresolveableExpression;
	}
	if (isConstant(leftExpression) && isConstant(rightExpression)) {
		if (leftExpression.value === undefined || rightExpression.value === undefined) {
			return constant(leftExpression.value === rightExpression.value);
		}

		switch (operator) {
			case "!==":
				return constant(leftExpression.value !== rightExpression.value);
			case "<":
				return constant(leftExpression.value < rightExpression.value);
			case "<=":
				return constant(leftExpression.value <= rightExpression.value);
			case ">":
				return constant(leftExpression.value > rightExpression.value);
			case ">=":
				return constant(leftExpression.value >= rightExpression.value);
			case "===":
			default:
				return constant(leftExpression.value === rightExpression.value);
		}
	} else {
		return {
			_type: "Comparison",
			operator: operator,
			operand1: leftExpression,
			operand2: rightExpression
		};
	}
}

/**
 * Comparison: "equal" (===).
 *
 * @template T The target type
 * @param leftOperand The operand on the left side
 * @param rightOperand The operand on the right side of the comparison
 * @returns {Expression<boolean>} An expression representing the comparison
 */
export function equal<T extends PrimitiveType>(
	leftOperand: ExpressionOrPrimitive<T>,
	rightOperand: ExpressionOrPrimitive<T>
): Expression<boolean> {
	const leftExpression = wrapPrimitive(leftOperand);
	const rightExpression = wrapPrimitive(rightOperand);
	if (hasUnresolveableExpression(leftExpression, rightExpression)) {
		return unresolveableExpression;
	}
	if (_checkExpressionsAreEqual(leftExpression, rightExpression)) {
		return constant(true);
	}

	// ((a === c) === true) => (a === c)
	if (leftExpression._type === "Comparison" && isConstant(rightExpression) && rightExpression.value === true) {
		return leftExpression;
	} else if (leftExpression._type === "Comparison" && isConstant(rightExpression) && rightExpression.value === true) {
		// ((a === c) === false) => !(a === c)
		return not(leftExpression);
	} else if (leftExpression._type === "IfElse" && _checkExpressionsAreEqual(leftExpression.onTrue, rightExpression)) {
		// (if(xxxx) { aaa } else { bbb } ) === aaa )
		return or(leftExpression.condition, equal(leftExpression.onFalse, rightExpression));
	} else if (leftExpression._type === "IfElse" && _checkExpressionsAreEqual(leftExpression.onFalse, rightExpression)) {
		return or(not(leftExpression.condition), equal(leftExpression.onTrue, rightExpression));
	} else if (
		leftExpression._type === "IfElse" &&
		isConstant(leftExpression.onTrue) &&
		isConstant(rightExpression) &&
		isConstant(leftExpression.onFalse) &&
		!_checkExpressionsAreEqual(leftExpression.onTrue, rightExpression) &&
		!_checkExpressionsAreEqual(leftExpression.onFalse, rightExpression)
	) {
		return constant(false);
	}

	return comparison("===", leftExpression, rightExpression);
}

/**
 * Comparison: "not equal" (!==).
 *
 * @template T The target type
 * @param leftOperand The operand on the left side
 * @param rightOperand The operand on the right side of the comparison
 * @returns {Expression<boolean>} An expression representing the comparison
 */
export function notEqual<T extends PrimitiveType>(
	leftOperand: ExpressionOrPrimitive<T>,
	rightOperand: ExpressionOrPrimitive<T>
): Expression<boolean> {
	const leftExpression = wrapPrimitive(leftOperand);
	const rightExpression = wrapPrimitive(rightOperand);

	if (_checkExpressionsAreEqual(leftExpression, rightExpression)) {
		return constant(false);
	}

	// ((a === c) !== true) => !(a === c)
	if (leftExpression._type === "Comparison" && isConstant(rightExpression) && rightExpression.value === true) {
		return not(leftExpression);
	} else if (leftExpression._type === "Comparison" && isConstant(rightExpression) && rightExpression.value === true) {
		// ((a === c) !== false) => (a === c)
		return leftExpression;
	} else if (leftExpression._type === "IfElse" && _checkExpressionsAreEqual(leftExpression.onTrue, rightExpression)) {
		return and(not(leftExpression.condition), notEqual(leftExpression.onFalse, rightExpression));
	} else if (leftExpression._type === "IfElse" && _checkExpressionsAreEqual(leftExpression.onFalse, rightExpression)) {
		return and(leftExpression.condition, notEqual(leftExpression.onTrue, rightExpression));
	} else if (
		leftExpression._type === "IfElse" &&
		isConstant(leftExpression.onTrue) &&
		isConstant(rightExpression) &&
		isConstant(leftExpression.onFalse) &&
		!_checkExpressionsAreEqual(leftExpression.onTrue, rightExpression) &&
		!_checkExpressionsAreEqual(leftExpression.onFalse, rightExpression)
	) {
		// If the left expression is an if else where both onTrue and onFalse are not equals to the right expression -> simplify as true
		return constant(true);
	}

	return comparison("!==", leftExpression, rightExpression);
}

/**
 * Comparison: "greater or equal" (>=).
 *
 * @template T The target type
 * @param leftOperand The operand on the left side
 * @param rightOperand The operand on the right side of the comparison
 * @returns {Expression<boolean>} An expression representing the comparison
 */
export function greaterOrEqual<T extends PrimitiveType>(
	leftOperand: ExpressionOrPrimitive<T>,
	rightOperand: ExpressionOrPrimitive<T>
): Expression<boolean> {
	return comparison(">=", leftOperand, rightOperand);
}

/**
 * Comparison: "greater than" (>).
 *
 * @template T The target type
 * @param leftOperand The operand on the left side
 * @param rightOperand The operand on the right side of the comparison
 * @returns {Expression<boolean>} An expression representing the comparison
 */
export function greaterThan<T extends PrimitiveType>(
	leftOperand: ExpressionOrPrimitive<T>,
	rightOperand: ExpressionOrPrimitive<T>
): Expression<boolean> {
	return comparison(">", leftOperand, rightOperand);
}

/**
 * Comparison: "less or equal" (<=).
 *
 * @template T The target type
 * @param leftOperand The operand on the left side
 * @param rightOperand The operand on the right side of the comparison
 * @returns {Expression<boolean>} An expression representing the comparison
 */
export function lessOrEqual<T extends PrimitiveType>(
	leftOperand: ExpressionOrPrimitive<T>,
	rightOperand: ExpressionOrPrimitive<T>
): Expression<boolean> {
	return comparison("<=", leftOperand, rightOperand);
}

/**
 * Comparison: "less than" (<).
 *
 * @template T The target type
 * @param leftOperand The operand on the left side
 * @param rightOperand The operand on the right side of the comparison
 * @returns {Expression<boolean>} An expression representing the comparison
 */
export function lessThan<T extends PrimitiveType>(
	leftOperand: ExpressionOrPrimitive<T>,
	rightOperand: ExpressionOrPrimitive<T>
): Expression<boolean> {
	return comparison("<", leftOperand, rightOperand);
}

/**
 * If-then-else expression.
 *
 * Evaluates to onTrue if the condition evaluates to true, else evaluates to onFalse.
 *
 * @template T The target type
 * @param condition The condition to evaluate
 * @param onTrue Expression result if the condition evaluates to true
 * @param onFalse Expression result if the condition evaluates to false
 * @returns {Expression<T>} The expression that represents this conditional check
 */
export function ifElse<T extends PrimitiveType>(
	condition: ExpressionOrPrimitive<boolean>,
	onTrue: ExpressionOrPrimitive<T>,
	onFalse: ExpressionOrPrimitive<T>
): Expression<T> {
	let conditionExpression = wrapPrimitive(condition);
	let onTrueExpression = wrapPrimitive(onTrue);
	let onFalseExpression = wrapPrimitive(onFalse);

	if (hasUnresolveableExpression(conditionExpression, onTrueExpression, onFalseExpression)) {
		return unresolveableExpression;
	}
	// swap branches if the condition is a negation
	if (conditionExpression._type === "Not") {
		// ifElse(not(X), a, b) --> ifElse(X, b, a)
		[onTrueExpression, onFalseExpression] = [onFalseExpression, onTrueExpression];
		conditionExpression = not(conditionExpression);
	}

	// inline nested if-else expressions: onTrue branch
	// ifElse(X, ifElse(X, a, b), c) ==> ifElse(X, a, c)
	if (onTrueExpression._type === "IfElse" && _checkExpressionsAreEqual(conditionExpression, onTrueExpression.condition)) {
		onTrueExpression = onTrueExpression.onTrue;
	}

	// inline nested if-else expressions: onFalse branch
	// ifElse(X, a, ifElse(X, b, c)) ==> ifElse(X, a, c)
	if (onFalseExpression._type === "IfElse" && _checkExpressionsAreEqual(conditionExpression, onFalseExpression.condition)) {
		onFalseExpression = onFalseExpression.onFalse;
	}

	// inline nested if-else expressions: condition
	if (conditionExpression._type === "IfElse") {
		if (
			isConstant(conditionExpression.onFalse) &&
			!conditionExpression.onFalse.value &&
			isConstant(conditionExpression.onTrue) &&
			conditionExpression.onTrue.value
		) {
			// ifElse(ifElse(X, true, false), a, b) ==> ifElse(X, a, b)
			conditionExpression = conditionExpression.condition;
		} else if (
			isConstant(conditionExpression.onFalse) &&
			conditionExpression.onFalse.value &&
			isConstant(conditionExpression.onTrue) &&
			!conditionExpression.onTrue.value
		) {
			// ifElse(ifElse(X, false, true), a, b) ==> ifElse(not(X), a, b)
			conditionExpression = not(conditionExpression.condition);
		} else if (
			isConstant(conditionExpression.onTrue) &&
			!conditionExpression.onTrue.value &&
			!isConstant(conditionExpression.onFalse)
		) {
			// ifElse(ifElse(X, false, a), b, c) ==> ifElse(and(not(X), a), b, c)
			conditionExpression = and(not(conditionExpression.condition), conditionExpression.onFalse);
		}
	}

	// again swap branches if needed (in case one of the optimizations above led to a negated condition)
	if (conditionExpression._type === "Not") {
		// ifElse(not(X), a, b) --> ifElse(X, b, a)
		[onTrueExpression, onFalseExpression] = [onFalseExpression, onTrueExpression];
		conditionExpression = not(conditionExpression);
	}

	// compute expression result for constant conditions
	if (isConstant(conditionExpression)) {
		return conditionExpression.value ? onTrueExpression : onFalseExpression;
	}

	// compute expression result if onTrue and onFalse branches are equal
	if (_checkExpressionsAreEqual(onTrueExpression, onFalseExpression)) {
		return onTrueExpression;
	}

	// If either trueExpression or falseExpression is a value equals to false the expression can be simplified
	// If(Condition) Then XXX Else False -> Condition && XXX
	if (isConstant(onFalseExpression) && onFalseExpression.value === false) {
		return and(conditionExpression, onTrueExpression as Expression<boolean>) as Expression<T>;
	}
	// If(Condition) Then False Else XXX -> !Condition && XXX
	if (isConstant(onTrueExpression) && onTrueExpression.value === false) {
		return and(not(conditionExpression), onFalseExpression as Expression<boolean>) as Expression<T>;
	}

	return {
		_type: "IfElse",
		condition: conditionExpression,
		onTrue: onTrueExpression,
		onFalse: onFalseExpression
	};
}

/**
 * Checks whether the current expression has a reference to the default model (undefined).
 *
 * @param expression The expression to evaluate
 * @returns {boolean} `true` if there is a reference to the default context
 */
function hasReferenceToDefaultContext(expression: Expression<any>): boolean {
	switch (expression._type) {
		case "Constant":
		case "Formatter":
		case "ComplexType":
			return false;
		case "Set":
			return expression.operands.some(hasReferenceToDefaultContext);
		case "Binding":
			return expression.modelName === undefined;
		case "Comparison":
			return hasReferenceToDefaultContext(expression.operand1) || hasReferenceToDefaultContext(expression.operand2);
		case "DefaultBinding":
			return true;
		case "IfElse":
			return (
				hasReferenceToDefaultContext(expression.condition) ||
				hasReferenceToDefaultContext(expression.onTrue) ||
				hasReferenceToDefaultContext(expression.onFalse)
			);
		case "Not":
		case "Truthy":
			return hasReferenceToDefaultContext(expression.operand);
		default:
			return false;
	}
}

type Fn<T> = ((...params: any) => T) & {
	__functionName: string;
};

/**
 * @typedef WrappedTuple
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type WrappedTuple<T> = { [K in keyof T]: WrappedTuple<T[K]> | ExpressionOrPrimitive<T[K]> };

// So, this works but I cannot get it to compile :D, but it still does what is expected...

/**
 * A function reference or a function name.
 */
type FunctionOrName<T> = Fn<T> | string;

/**
 * Function parameters, either derived from the function or an untyped array.
 */
type FunctionParameters<T, F extends FunctionOrName<T>> = F extends Fn<T> ? Parameters<F> : any[];

/**
 * Calls a formatter function to process the parameters.
 * If requireContext is set to true and no context is passed a default context will be added automatically.
 *
 * @template T
 * @template U
 * @param parameters The list of parameter that should match the type and number of the formatter function
 * @param formatterFunction The function to call
 * @param [contextEntityType] The context entity type to consider
 * @returns {Expression<T>} The corresponding expression
 */
export function formatResult<T, U extends Fn<T>>(
	parameters: WrappedTuple<Parameters<U>>,
	formatterFunction: U,
	contextEntityType?: EntityType
): Expression<T> {
	const parameterExpressions = (parameters as any[]).map(wrapPrimitive);

	if (hasUnresolveableExpression(...parameterExpressions)) {
		return unresolveableExpression;
	}
	if (!!contextEntityType) {
		// Otherwise, if the context is required and no context is provided make sure to add the default binding
		if (!parameterExpressions.some(hasReferenceToDefaultContext)) {
			contextEntityType.keys.forEach(key => parameterExpressions.push(bindingExpression(key.name, "")));
		}
	}

	// FormatterName can be of format sap.fe.core.xxx#methodName to have multiple formatter in one class
	const [formatterClass, formatterName] = formatterFunction.__functionName.split("#");

	if (!!formatterName && formatterName.length > 0) {
		parameterExpressions.unshift(constant(formatterName));
	}

	return {
		_type: "Formatter",
		fn: formatterClass,
		parameters: parameterExpressions
	};
}

/**
 * Calls a complex type  to process the parameters.
 * If requireContext is set to true and no context is passed a default context will be added automatically.
 *
 * @template T
 * @template U
 * @param parameters The list of parameter that should match the type for the compplex type
 * @param type The complex type to use
 * @param [contextEntityType] The context entity type to consider
 * @returns {Expression<T>} The corresponding expression
 */
export function addTypeInformation<T, U extends Fn<T>>(
	parameters: WrappedTuple<Parameters<U>>,
	type: string,
	contextEntityType?: EntityType
): Expression<T> {
	const parameterExpressions = (parameters as any[]).map(wrapPrimitive);
	if (hasUnresolveableExpression(...parameterExpressions)) {
		return unresolveableExpression;
	}
	// If there is only one parameter and it is a constant and we don't expect the context then return the constant
	if (parameterExpressions.length === 1 && isConstant(parameterExpressions[0]) && !contextEntityType) {
		return parameterExpressions[0];
	} else if (!!contextEntityType) {
		// Otherwise, if the context is required and no context is provided make sure to add the default binding
		if (!parameterExpressions.some(hasReferenceToDefaultContext)) {
			contextEntityType.keys.forEach(key => parameterExpressions.push(bindingExpression(key.name, "")));
		}
	}

	const oFormatOptions =
		(parameters[0] as any)?.type?.indexOf("sap.ui.model.odata.type.Int") === 0 ? { parseAsString: false, emptyString: "" } : {};
	return {
		_type: "ComplexType",
		type: type,
		formatOptions: oFormatOptions,
		parameters: {},
		bindingParameters: parameterExpressions
	};
}
/**
 * Function call, optionally with arguments.
 *
 * @param fn Function name or reference to function
 * @param parameters Arguments
 * @param on Object to call the function on
 * @returns {FunctionExpression<T>} Expression representing the function call (not the result of the function call!)
 */
export function fn<T, U extends FunctionOrName<T>>(
	fn: U,
	parameters: WrappedTuple<FunctionParameters<T, U>>,
	on?: ExpressionOrPrimitive<object>
): FunctionExpression<T> {
	const functionName = typeof fn === "string" ? fn : (fn as Fn<T>).__functionName;
	return {
		_type: "Function",
		obj: on !== undefined ? wrapPrimitive(on) : undefined,
		fn: functionName,
		parameters: (parameters as any[]).map(wrapPrimitive)
	};
}

/**
 * Shortcut function to determine if a binding value is null, undefined or empty.
 *
 * @param expression
 * @returns A boolean expression evaluating the fact that the current element is empty
 */
export function isEmpty(expression: Expression<string>): Expression<boolean> {
	if (expression._type === "Concat") {
		return or(...expression.expressions.map(isEmpty));
	}
	return or(equal(expression, ""), equal(expression, undefined), equal(expression, null));
}

export function concat(...inExpressions: ExpressionOrPrimitive<string>[]): Expression<string> {
	const expressions = inExpressions.map(wrapPrimitive);
	if (hasUnresolveableExpression(...expressions)) {
		return unresolveableExpression;
	}
	if (expressions.every(isConstant)) {
		return constant(
			expressions.reduce((concatenated: string, value) => {
				return concatenated + (value as ConstantExpression<any>).value.toString();
			}, "")
		);
	}
	return {
		_type: "Concat",
		expressions: expressions
	};
}

export type TransformFunction = <T extends PrimitiveType | unknown>(expressionPart: any) => Expression<T>;
export type ExpressionType = Pick<Expression<any>, "_type">["_type"];
export function transformRecursively<T extends PrimitiveType | unknown>(
	inExpression: Expression<T>,
	expressionType: ExpressionType,
	transformFunction: TransformFunction,
	includeAllExpression: boolean = false
): Expression<T> {
	let expression = inExpression;
	switch (expression._type) {
		case "Function":
			expression.parameters = expression.parameters.map(expression =>
				transformRecursively(expression, expressionType, transformFunction, includeAllExpression)
			);
			break;
		case "Concat":
			expression.expressions = expression.expressions.map(expression =>
				transformRecursively(expression, expressionType, transformFunction, includeAllExpression)
			);
			break;
		case "ComplexType":
			expression.bindingParameters = expression.bindingParameters.map(expression =>
				transformRecursively(expression, expressionType, transformFunction, includeAllExpression)
			);
			break;
		case "Formatter":
			expression.parameters = expression.parameters.map(expression =>
				transformRecursively(expression, expressionType, transformFunction, includeAllExpression)
			);
			break;

		case "IfElse":
			const onTrue = transformRecursively(expression.onTrue, expressionType, transformFunction, includeAllExpression);
			const onFalse = transformRecursively(expression.onFalse, expressionType, transformFunction, includeAllExpression);
			let condition = expression.condition;
			if (includeAllExpression) {
				condition = transformRecursively(expression.condition, expressionType, transformFunction, includeAllExpression);
			}
			expression = ifElse(condition, onTrue, onFalse) as Expression<T>;
			break;
		case "Not":
			if (includeAllExpression) {
				const operand = transformRecursively(expression.operand, expressionType, transformFunction, includeAllExpression);
				expression = not(operand) as Expression<T>;
			}
			break;
		case "Truthy":
			break;
		case "Set":
			if (includeAllExpression) {
				expression.operands = expression.operands.map(expression =>
					transformRecursively(expression, expressionType, transformFunction, includeAllExpression)
				);
			}
			break;
		case "Comparison":
			if (includeAllExpression) {
				const operand1 = transformRecursively(expression.operand1, expressionType, transformFunction, includeAllExpression);
				const operand2 = transformRecursively(expression.operand2, expressionType, transformFunction, includeAllExpression);
				expression = comparison(expression.operator, operand1, operand2) as Expression<T>;
			}
			break;
		case "DefaultBinding":
		case "Ref":
		case "Binding":
		case "Constant":
			// Do nothing
			break;
	}
	if (expressionType === expression._type) {
		expression = transformFunction(inExpression);
	}
	return expression;
}

export type BindingExpression<T> = T | string | undefined;

/**
 * Compile an expression into an expression binding.
 *
 * @template T The target type
 * @param expression The expression to compile
 * @param embeddedInBinding Whether the expression to compile is embedded into another expression
 * @param keepTargetType Keep the target type of the embedded bindings instead of casting them to any
 * @returns {BindingExpression<T>} The corresponding expression binding
 */
export function compileBinding<T extends PrimitiveType>(
	expression: ExpressionOrPrimitive<T>,
	embeddedInBinding: boolean = false,
	keepTargetType: boolean = false
): BindingExpression<string> {
	const expr = wrapPrimitive(expression);
	const embeddedSeparator = keepTargetType ? "$" : "%";
	let outProperty = "";
	switch (expr._type) {
		case "Unresolveable":
			return undefined;
		case "Constant":
			if (expr.value === null) {
				return "null";
			}
			if (expr.value === undefined) {
				return "undefined";
			}
			if (typeof expr.value === "object") {
				if (Array.isArray(expr.value)) {
					const entries = expr.value.map(expression => compileBinding(expression, true));
					return `[${entries.join(", ")}]`;
				} else {
					// Objects
					const o = expr.value as PlainExpressionObject;
					const properties = Object.keys(o).map(key => {
						const value = o[key];
						return `${key}: ${compileBinding(value, true)}`;
					});
					return `{${properties.join(", ")}}`;
				}
			}

			if (embeddedInBinding) {
				switch (typeof expr.value) {
					case "number":
					case "bigint":
					case "boolean":
						return expr.value.toString();
					case "string":
						return `'${escapeXmlAttribute(expr.value.toString())}'`;
					default:
						return "";
				}
			} else {
				return expr.value.toString();
			}

		case "Ref":
			return expr.ref || "null";

		case "Function":
			const argumentString = `${expr.parameters.map(arg => compileBinding(arg, true)).join(", ")}`;
			return expr.obj === undefined
				? `${expr.fn}(${argumentString})`
				: `${compileBinding(expr.obj, true)}.${expr.fn}(${argumentString})`;
		case "EmbeddedExpressionBinding":
			if (embeddedInBinding) {
				return `(${expr.value.substr(2, expr.value.length - 3)})`;
			} else {
				return `${expr.value}`;
			}
		case "EmbeddedBinding":
			if (embeddedInBinding) {
				return `${embeddedSeparator}${expr.value}`;
			} else {
				return `${expr.value}`;
			}
		case "DefaultBinding":
		case "Binding":
			if (expr.type || expr.parameters || expr.targetType) {
				let outBinding = "";
				if (embeddedInBinding) {
					outBinding += `${embeddedSeparator}`;
				}
				outBinding += `{path:'${expr.modelName ? `${expr.modelName}>` : ""}${expr.path}'`;
				if (expr.type) {
					outBinding += `, type: '${expr.type}'`;
				}
				if (expr.constraints && Object.keys(expr.constraints).length > 0) {
					outBinding += `, constraints: ${compileBinding(expr.constraints)}`;
				}
				if (expr.formatOptions) {
					outBinding += `, formatOptions: ${compileBinding(expr.formatOptions)}`;
				}
				if (expr.parameters && Object.keys(expr.parameters).length > 0) {
					outBinding += `, parameters: ${compileBinding(expr.parameters)}`;
				}
				if (expr.targetType) {
					outBinding += `, targetType: '${expr.targetType}'`;
				}
				outBinding += "}";
				return outBinding;
			} else {
				if (embeddedInBinding) {
					return `${embeddedSeparator}{${expr.modelName ? `${expr.modelName}>` : ""}${expr.path}}`;
				} else {
					return `{${expr.modelName ? `${expr.modelName}>` : ""}${expr.path}}`;
				}
			}

		case "Comparison":
			const comparisonPart = `${compileBinding(expr.operand1, true)} ${expr.operator} ${compileBinding(expr.operand2, true)}`;
			if (embeddedInBinding) {
				return comparisonPart;
			}
			return `{= ${comparisonPart}}`;

		case "IfElse":
			if (embeddedInBinding) {
				return `(${compileBinding(expr.condition, true)} ? ${compileBinding(expr.onTrue, true)} : ${compileBinding(
					expr.onFalse,
					true
				)})`;
			} else {
				return `{= ${compileBinding(expr.condition, true)} ? ${compileBinding(expr.onTrue, true)} : ${compileBinding(
					expr.onFalse,
					true
				)}}`;
			}

		case "Set":
			if (embeddedInBinding) {
				return `(${expr.operands.map(expression => compileBinding(expression, true)).join(` ${expr.operator} `)})`;
			} else {
				return `{= (${expr.operands.map(expression => compileBinding(expression, true)).join(` ${expr.operator} `)})}`;
			}

		case "Concat":
			if (embeddedInBinding) {
				return `${expr.expressions.map(expression => compileBinding(expression, true, true)).join(` + `)}`;
			} else {
				return `{= ${expr.expressions.map(expression => compileBinding(expression, true, true)).join(` + `)} }`;
			}

		case "Not":
			if (embeddedInBinding) {
				return `!${compileBinding(expr.operand, true)}`;
			} else {
				return `{= !${compileBinding(expr.operand, true)}}`;
			}

		case "Truthy":
			if (embeddedInBinding) {
				return `!!${compileBinding(expr.operand, true)}`;
			} else {
				return `{= !!${compileBinding(expr.operand, true)}}`;
			}

		case "Formatter":
			if (expr.parameters.length === 1) {
				outProperty += `{${compilePathParameter(expr.parameters[0], true)}, formatter: '${expr.fn}'}`;
			} else {
				outProperty += `{parts:[${expr.parameters.map((param: any) => compilePathParameter(param)).join(",")}], formatter: '${
					expr.fn
				}'}`;
			}
			if (embeddedInBinding) {
				outProperty = `\$${outProperty}`;
			}
			return outProperty;
		case "ComplexType":
			if (expr.bindingParameters.length === 1) {
				outProperty += `{${compilePathParameter(expr.bindingParameters[0], true)}, type: '${expr.type}'}`;
			} else {
				let outputEnd;
				// this code is based on sap.ui.model.odata.v4._AnnotationHelperExpression.fetchCurrencyOrUnit
				switch (expr.type) {
					case "sap.ui.model.odata.type.Unit":
						outputEnd = `,{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'`;
						break;
					case "sap.ui.model.odata.type.Currency":
						outputEnd = `,{mode:'OneTime',path:'/##@@requestCurrencyCodes',targetType:'any'}],type:'sap.ui.model.odata.type.Currency'`;
						break;
					default:
						outputEnd = `], type: '${expr.type}'`;
				}
				if (expr.formatOptions && Object.keys(expr.formatOptions).length > 0) {
					outputEnd += `, formatOptions: ${compileBinding(expr.formatOptions)}`;
				}
				if (expr.parameters && Object.keys(expr.parameters).length > 0) {
					outputEnd += `, parameters: ${compileBinding(expr.parameters)}`;
				}
				outputEnd += "}";
				outProperty += `{mode:'TwoWay', parts:[${expr.bindingParameters
					.map((param: any) => compilePathParameter(param))
					.join(",")}${outputEnd}`;
			}
			if (embeddedInBinding) {
				outProperty = `\$${outProperty}`;
			}
			return outProperty;
		default:
			return "";
	}
}

/**
 * Compile the path parameter of a formatter call.
 *
 * @param expression The binding part to evaluate
 * @param singlePath Whether there is one or multiple path to consider
 * @returns {string} The string snippet to include in the overall binding definition
 */
function compilePathParameter(expression: Expression<any>, singlePath: boolean = false): string {
	let outValue = "";
	switch (expression._type) {
		case "Constant":
			switch (typeof expression.value) {
				case "number":
				case "bigint":
					outValue = `value: ${expression.value.toString()}`;
					break;
				case "string":
					outValue = `value: '${escapeXmlAttribute(expression.value.toString())}'`;
					break;
				case "boolean":
					outValue = `value: '${expression.value.toString()}'`;
					break;
				default:
					outValue = "value: ''";
					break;
			}
			if (singlePath) {
				return outValue;
			}
			return `{${outValue}}`;

		case "DefaultBinding":
		case "Binding":
			outValue = `path:'${expression.modelName ? `${expression.modelName}>` : ""}${expression.path}'`;

			if (expression.type) {
				outValue += `, type : '${expression.type}'`;
			} else {
				outValue += `, targetType : 'any'`;
			}
			if (expression.constraints && Object.keys(expression.constraints).length > 0) {
				outValue += `, constraints: ${compileBinding(expression.constraints)}`;
			}
			if (expression.formatOptions && Object.keys(expression.formatOptions).length > 0) {
				outValue += `, formatOptions: ${compileBinding(expression.formatOptions)}`;
			}
			if (expression.parameters && Object.keys(expression.parameters).length > 0) {
				outValue += `, parameters: ${compileBinding(expression.parameters)}`;
			}
			if (singlePath) {
				return outValue;
			}
			return `{${outValue}}`;
		default:
			return "";
	}
}
