import * as FRAGS from '@thatopen/fragments'
import fs from 'fs'

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

export const fetchElementsOfCategory = (
  fragments: FRAGS.SingleThreadedFragmentsModel,
  category: string,
  config: Partial<FRAGS.ItemsDataConfig>
) => {
  const elementsOfCategory = fragments.getItemsOfCategories([
    new RegExp(category),
  ])
  const ids = Object.values(elementsOfCategory)
    .flat()
    .filter((id) => id !== undefined && id !== null)
  const itemsData = fragments.getItemsData(ids, config)

  return itemsData
}
