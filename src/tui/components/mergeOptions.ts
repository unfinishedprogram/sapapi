import * as blessed  from "blessed"

export default function mergeOptions<T>(target:T, other:T):T {
	return Object.assign(target, other);
}