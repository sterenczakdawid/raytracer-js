class Sphere {
	constructor(center, radius, color, reflective, alpha, k_s, k_d, k_a) {
		this.center = center;
		this.radius = radius;
		this.color = color;
		this.reflective = reflective;
		this.alpha = alpha;
		this.k_a = k_a;
		this.k_d = k_d;
		this.k_s = k_s;
	}
}

export const SPHERES = [
	// metal
	new Sphere([-1, 0, 3], 0.5, [130, 130, 120], 0.8, 500, 0.8, 0.2, 0.1),

	//sciana
	new Sphere([1, 0, 3], 0.5, [230, 230, 150], 0.001, 40, 0.1, 0.5, 0.2),

	//plastik
	new Sphere([-1, 1, 6], 0.5, [30, 170, 0], 0.005, 100, 0.1, 0.8, 0.5),

	//drewno
	new Sphere([1, 1, 6], 0.5, [90, 60, 0], 0.001, 10, 0.1, 0.7, 0.2),

	//podloze
	new Sphere([0, -5001, 0], 5000, [255, 255, 0], 0.001, 10, 0.1, 0.7, 0.2),
];

// export const SPHERES = [
// 	// metal
// 	new Sphere([-1, 0, 3], 0.5, [130, 130, 120], 0.8, 500, 0.8, 0.2, 0.1),
// 	// sciana
// 	new Sphere([1, 0, 3], 0.5, [230, 230, 150], 0.001, 100, 0.1, 0.5, 0.2),
// 	// plastik
// 	new Sphere([-1, 1, 6], 0.5, [255, 0, 0], 0.005, 50, 0.1, 0.9, 0.3),
// 	// drewno
// 	new Sphere([1, 1, 6], 0.5, [90, 60, 0], 0.001, 10, 0.1, 0.85, 0.25),
// 	// podloze
// 	new Sphere([0, -5001, 0], 5000, [255, 255, 0], 0.001, 10, 0.1, 0.7, 0.2),
// ];
