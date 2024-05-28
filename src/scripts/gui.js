import { GUI } from "lil-gui";

export function createGUI(lights, renderScene) {
	const gui = new GUI();

	const ambientLight = lights[0];
	const pointLight = lights[1];

	const ambientLightFolder = gui.addFolder("Ambient light");
	ambientLightFolder
		.add(ambientLight, "intensity", 0, 5)
		.name("Intensity")
		.onChange(renderScene);

	const pointLightFolder = gui.addFolder("Point light");
	pointLightFolder
		.add(pointLight, "intensity", 0, 5)
		.name("Intensity")
		.onChange(renderScene);
}
