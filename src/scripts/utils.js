// iloczyn skalarny 2 wektorow
export const dot = (v1, v2) => {
	return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
};

// suma 2 wektorow
export const add = (v1, v2) => {
	return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
};

// roznica 2 wektorow
export const sub = (v1, v2) => {
	return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
};

// dlugosc wektora 3D
export const length = (vec) => {
	return Math.sqrt(dot(vec, vec));
};

// k * wektor ( skalar * wektor )
export const multiplySV = (k, vec) => {
	return [k * vec[0], k * vec[1], k * vec[2]];
};

// macierz * wektor
export const multiplyMV = (mat, vec) => {
	let result = [0, 0, 0];

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			result[i] += vec[j] * mat[i][j];
		}
	}

	return result;
};

// Clamps a color to the canonical color range.
export const clamp = (vec) => {
	return [
		Math.min(255, Math.max(0, vec[0])),
		Math.min(255, Math.max(0, vec[1])),
		Math.min(255, Math.max(0, vec[2])),
	];
};

// Computes the reflection of v1 respect to v2.
export const reflectRay = (v1, v2) => {
	return sub(multiplySV(2 * dot(v1, v2), v2), v1);
};
