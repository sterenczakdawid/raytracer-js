class Light {
	constructor(intensity) {
		this.intensity = intensity;
	}
}

export class PointLight extends Light {
	constructor(intensity, position) {
		super(intensity);
		this.position = position;
	}
}

export class AmbientLight extends Light {
	constructor(intensity) {
		super(intensity);
	}
}

export class DirectionalLight extends Light {
	constructor(intensity, position) {
		super(intensity);
		this.position = position;
	}
}

export const LIGHTS = [new AmbientLight(0.2), new PointLight(1.6, [1, 3, -4])];
