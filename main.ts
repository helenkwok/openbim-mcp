import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import * as FRAGS from '@thatopen/fragments'
import fs from 'fs'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { convertIfcToFragment, fetchCategoriesWithGeometry, fetchElementsOfCategory, loadFragments } from './fragements'

let fragments: FRAGS.SingleThreadedFragmentsModel

const server = new McpServer({
  name: 'BIM',
  version: '1.0.0',
})

server.tool(
  'convert-ifc-to-frag',
  'Convert an IFC file to a .frag file. Needs file-system server',
  {
    inputPath: z.string().describe('Full path of the IFC file to convert'),
    outputPath: z
      .string()
      .describe('Full path where the output .frags file will be saved'),
  },
  async ({ inputPath, outputPath }) => {
    if (!fs.existsSync(inputPath)) {
      return {
        content: [
          {
            type: 'text',
            text: 'IFC file not found. Please provide a valid .ifc file path.',
          },
        ],
      }
    }

    if (fs.existsSync(outputPath)) {
      return {
        content: [
          {
            type: 'text',
            text: 'Output .frag file already exists. Please call load-frag directly',
          },
        ],
      }
    }

   const model = await convertIfcToFragment(inputPath, outputPath)

    return {
      content: [
        {
          type: 'text',
          text: `Converted IFC file to .frag format. Output saved to ${outputPath}. Model contains ${
            model.getItemsWithGeometry().length
          } items with geometry: ${JSON.stringify(
            fetchCategoriesWithGeometry(fragments)
          )}`,
        },
      ],
    }
  }
)

server.tool(
  'load-frag',
  'Load a .frag file. Needs file-system server',
  {
    filePath: z
      .string()
      .describe('Full path of the file to load with fragments'),
  },
  async ({ filePath }) => {
    if (!fs.existsSync(filePath) || filePath.endsWith('.ifc')) {
      return {
        content: [
          {
            type: 'text',
            text: `No .frag file found. Please call convert-ifc-to-frag first: Input file path: ${filePath.replace(
              '.frag',
              '.ifc'
            )}; Output file path: ${filePath.replace('.ifc', '.frag')}`,
          },
        ],
      }
    }

    fragments = await loadFragments(filePath)

    return {
      content: [
        {
          type: 'text',
          text: `Loaded fragments from ${filePath}. Loaded ${fragments.getItemsWithGeometry().length} items with geometry: ${JSON.stringify(
            fetchCategoriesWithGeometry(fragments)
          )}`,
        },
      ],
    }
  }
)

server.tool(
  'fetch-elements-of-category',
  'Fetch elements of a specified category',
  {
    category: z.string().describe('Category name. e.g. IFCWALL'),
    config: z
      .object({
        attributesDefault: z.boolean(),
        attributes: z.array(z.string()),
        relations: z.object({
          HasAssociations: z.object({
            attributes: z.boolean(),
            relations: z.boolean(),
          }),
          IsDefinedBy: z.object({
            attributes: z.boolean(),
            relations: z.boolean(),
          }),
        }),
      })
      .describe('Configuration for fetching elements'),
  },
  ({ category, config }) => {
    if (!fragments) {
      return {
        content: [
          {
            type: 'text',
            text: 'No fragments loaded. Please call load-frag first.',
          },
        ],
      }
    }

    const itemsData = fetchElementsOfCategory(fragments, category, config)

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(itemsData),
        },
      ],
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
