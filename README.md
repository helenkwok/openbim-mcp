# Fragment MCP Server

A Model Context Protocol (MCP) server for working with Building Information Modeling (BIM) files. This server provides tools to convert IFC files to fragment format, load fragments, and query BIM data by category.

## Features

- **IFC to Fragment Conversion**: Convert Industry Foundation Classes (IFC) files to the open and  efficient fragment format
- **Fragment Loading**: Load and work with pre-converted fragment files
- **Category-based Querying**: Fetch BIM elements by category (e.g., walls, doors, windows) with configurable attributes and relations

## Tools

### `convert-ifc-to-frag`

Converts an IFC file to a .frag file format for efficient processing.

**Parameters:**

- `inputPath` (string): Full path of the IFC file to convert
- `outputPath` (string): Full path where the output .frags file will be saved

**Example:**

```text
Input: /path/to/building.ifc
Output: /path/to/building.frag
```

### `load-frag`

Loads a .frag file into memory for querying.

**Parameters:**

- `filePath` (string): Full path of the .frag file to load

### `fetch-elements-of-category`

Fetches elements of a specified IFC category from loaded fragments.

**Parameters:**

- `category` (string): Category name (e.g., "IFCWALL", "IFCDOOR", "IFCWINDOW")
- `config` (object): Configuration for fetching elements with the following structure:
  - `attributesDefault` (boolean): Include default attributes
  - `attributes` (array): List of specific attributes to include
  - `relations` (object): Relation configuration
    - `HasAssociations`: Include association relations
    - `IsDefinedBy`: Include definition relations

## Dependencies

- [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk): MCP server framework
- [`@thatopen/fragments`](https://github.com/ThatOpen/engine_fragment): Fragment processing library
- [`web-ifc`](https://github.com/ThatOpen/engine_web-ifc): IFC file processing
- [`zod`](https://github.com/colinhacks/zod): Schema validation

## Installation

1. Install dependencies:

```bash
pnpm install
```

1. Run the server:

```bash
node main.ts
```

## Claude Desktop Integration

To use this MCP server with Claude Desktop, add the following configuration to your Claude Desktop settings file:

### Configuration

1. Open Claude Desktop settings
2. Navigate to the MCP servers configuration
3. Add the following JSON configuration:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/your/models/directory"
      ]
    },
    "bim": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "/path/to/your/openbim-mcp/main.ts"
      ]
    }
  }
}
```

### Prerequisites for Claude Desktop

- Node.js must be installed and accessible via `npx`
- The `tsx` package should be available (install globally with `npm install -g tsx` if needed)
- Both the filesystem and bim servers need to be configured for full functionality

## Usage Workflow

1. **Convert IFC to Fragment**: Use `convert-ifc-to-frag` to convert your IFC file to the efficient fragment format
2. **Load Fragments**: Use `load-frag` to load the fragment file into memory
3. **Query Elements**: Use `fetch-elements-of-category` to retrieve specific building elements by their IFC category

## Supported IFC Categories

Common categories you can query include:

- `IFCWALL` - Walls
- `IFCDOOR` - Doors
- `IFCWINDOW` - Windows
- `IFCSLAB` - Slabs/Floors
- `IFCBEAM` - Beams
- `IFCCOLUMN` - Columns
- `IFCSPACE` - Spaces/Rooms

## Requirements

- Node.js
- File system access for reading IFC files and writing fragment files
- Compatible with Model Context Protocol clients

## Author

Helen Kwok
