import * as FRAGS from '@thatopen/fragments';
import fs from 'fs'
import { safeRegExp } from './utils';

export const convertIfcToFragment = async (
  inputPath: string,
  outputPath: string
) => {
  const ifcFile = await fs.promises.readFile(inputPath)
  const typedArray = new Uint8Array(ifcFile)
  const serializer = new FRAGS.IfcImporter()
  serializer.wasm = {
    path: '/',
    absolute: false,
  }
  const bytes = await serializer.process({ bytes: typedArray, raw: false })
  const model = new FRAGS.SingleThreadedFragmentsModel('model', bytes)

  await fs.promises.writeFile(outputPath, bytes)

  return model
}

export const loadFragments = async (filePath: string) => {
  const file = await fs.promises.readFile(filePath)

  const fragments = new FRAGS.SingleThreadedFragmentsModel('model', file)
  return fragments
}

// Returns categories that have associated geometry, along with their counts.
export const fetchCategoriesWithGeometry = (
  fragments: FRAGS.SingleThreadedFragmentsModel
) => {
  const categories = fragments.getCategories();
  const fragmentsWithGeometry = fragments.getItemsWithGeometry();
  const geometrySet = new Set(fragmentsWithGeometry);
  const categoriesWithCount = categories.map((category) => {
    const items = fragments.getItemsOfCategories([safeRegExp(category)]);
    const ids = Object.values(items)
      .flatMap((arr) => arr)
      .filter((id) => id !== undefined && id !== null);
    const count = ids.filter((id) => geometrySet.has(id)).length;
    return { category, count };
  });
  return categoriesWithCount.filter((c) => c.count > 0);
}

// Fetches elements of a given category from the fragments model using a safe regular expression.
export const fetchElementsOfCategory = (
  fragments: FRAGS.SingleThreadedFragmentsModel,
  category: string,
  config: Partial<FRAGS.ItemsDataConfig>
) => {
  const elementsOfCategory = fragments.getItemsOfCategories([
    safeRegExp(category),
  ]);
  const ids = Object.values(elementsOfCategory)
    .flat()
    .filter((id) => id !== undefined && id !== null);
  const itemsData = fragments.getItemsData(ids, config);

  return itemsData;
};
