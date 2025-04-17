// src/features/3dMap/api/loadModels.ts
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { mockBuildings } from './mockPoints';

export const loadAllModels = async () => {
  const loader = new GLTFLoader();
  const models = await Promise.all(
    mockBuildings.map(async (building) => {
      const gltf = await loader.loadAsync(building.model);
      return {
        ...building,
        scene: gltf.scene
      };
    })
  );
  return models; // Массив с моделями + исходными данными
};