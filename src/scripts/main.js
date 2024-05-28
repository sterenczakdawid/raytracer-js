import { add, clamp, dot, length, multiplySV, reflectRay, sub } from "./utils";
import { SPHERES } from "./sphere";
import { AmbientLight, LIGHTS, PointLight } from "./light";
import { createGUI } from "./gui";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas_buffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
const canvas_pitch = canvas_buffer.width * 4;

const viewport_size = 1;
const d = 1;
const camera_position = [0, 0, 0];
const background_color = [255, 255, 255];
const recursion_depth = 3;

const spheres = SPHERES;
const lights = LIGHTS;

const canvasToViewport = (x, y) => {
	return [
		(x * viewport_size) / canvas.width,
		(y * viewport_size) / canvas.height,
		d,
	];
};

const closestIntersection = (origin, direction, t_min, t_max) => {
	let closest_t = Infinity;
	let closest_sphere = null;

	spheres.forEach((sphere) => {
		const t = intersectRaySphere(origin, direction, sphere);
		if (t[0] >= t_min && t[0] <= t_max && t[0] < closest_t) {
			closest_t = t[0];
			closest_sphere = sphere;
		}
		if (t[1] >= t_min && t[1] <= t_max && t[1] < closest_t) {
			closest_t = t[1];
			closest_sphere = sphere;
		}
	});

	if (closest_sphere) {
		return [closest_sphere, closest_t];
	}

	return null;
};

const traceRay = (origin, direction, t_min, t_max, depth) => {
	const intersection = closestIntersection(origin, direction, t_min, t_max);

	if (!intersection) {
		return background_color;
	}

	const closest_sphere = intersection[0];
	const closest_t = intersection[1];

	const point = add(origin, multiplySV(closest_t, direction));
	let normal = sub(point, closest_sphere.center);
	normal = multiplySV(1.0 / length(normal), normal);

	const view = multiplySV(-1, direction);
	const lighting = computeLighting(
		point,
		normal,
		view,
		closest_sphere.k_s,
		closest_sphere.k_d,
		closest_sphere.k_a,
		closest_sphere.alpha
	);
	const local_color = multiplySV(lighting, closest_sphere.color);

	if (closest_sphere.reflective <= 0 || depth <= 0) {
		return local_color;
	}

	const reflected_ray = reflectRay(view, normal);
	const reflected_color = traceRay(
		point,
		reflected_ray,
		0.001,
		Infinity,
		depth - 1
	);

	return add(
		multiplySV(1 - closest_sphere.reflective, local_color),
		multiplySV(closest_sphere.reflective, reflected_color)
	);
};

const intersectRaySphere = (origin, direction, sphere) => {
	const r = sphere.radius;
	const oc = sub(origin, sphere.center);

	const a = dot(direction, direction);
	const b = 2 * dot(oc, direction);
	const c = dot(oc, oc) - r * r;

	const discriminant = b * b - 4 * a * c;
	if (discriminant < 0) {
		return [Infinity, Infinity];
	}

	const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
	const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
	return [t1, t2];
};

const computeLighting = (point, normal, view, k_s, k_d, k_a, alpha) => {
	let intensity = 0;
	const length_n = length(normal);
	const length_v = length(view);

	for (let i = 0; i < lights.length; i++) {
		const light = lights[i];
		if (light instanceof AmbientLight) {
			intensity += light.intensity * k_a;
		} else {
			let vec_l, t_max;
			if (light instanceof PointLight) {
				vec_l = sub(light.position, point);
				t_max = 1.0;
			} else {
				// directional
				vec_l = light.position;
				t_max = Infinity;
			}

			// shadow check
			const blocker = closestIntersection(point, vec_l, 0.001, t_max);

			if (blocker) {
				continue;
			}

			// diffuse
			const normal_dot_l = dot(normal, vec_l);
			if (normal_dot_l > 0) {
				intensity +=
					(light.intensity * k_d * normal_dot_l) / (length_n * length(vec_l));
			}

			if (alpha != -1) {
				const vec_r = reflectRay(vec_l, normal);
				const r_dot_v = dot(vec_r, view);
				if (r_dot_v > 0) {
					intensity +=
						light.intensity *
						k_s *
						Math.pow(r_dot_v / (length(vec_r) * length_v), alpha);
				}
			}
		}
	}

	return intensity;
};

const drawPixel = (x, y, color) => {
	x = canvas.width / 2 + x;
	y = canvas.height / 2 - y - 1;

	if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
		return;
	}

	let offset = 4 * x + canvas_pitch * y;
	canvas_buffer.data[offset++] = color[0];
	canvas_buffer.data[offset++] = color[1];
	canvas_buffer.data[offset++] = color[2];
	canvas_buffer.data[offset++] = 255; // Alpha = 255 (full opacity)
};

// Displays the contents of the offscreen buffer into the canvas.
const updateCanvas = () => {
	ctx.putImageData(canvas_buffer, 0, 0);
};

const renderScene = () => {
	for (let x = -canvas.width / 2; x < canvas.width / 2; x++) {
		for (let y = -canvas.height / 2; y < canvas.height / 2; y++) {
			const direction = canvasToViewport(x, y);
			const color = traceRay(
				camera_position,
				direction,
				1,
				Infinity,
				recursion_depth
			);
			drawPixel(x, y, clamp(color));
		}
	}
	updateCanvas();
};

const handleKeyPress = (event) => {
	const pointLight = lights.find((light) => light instanceof PointLight);
	if (!pointLight) return;

	const step = 1; // Adjust this value for faster/slower movement

	switch (event.key) {
		case "ArrowUp":
			pointLight.position[1] += step;
			break;
		case "ArrowDown":
			pointLight.position[1] -= step;
			break;
		case "ArrowLeft":
			pointLight.position[0] -= step;
			break;
		case "ArrowRight":
			pointLight.position[0] += step;
			break;
		case "PageUp":
			pointLight.position[2] += step;
			break;
		case "PageDown":
			pointLight.position[2] -= step;
			break;
		default:
			return;
	}

	renderScene();
};

// Attach event listener for key presses
window.addEventListener("keydown", handleKeyPress);

// Initial render
createGUI(lights, renderScene);
renderScene();
