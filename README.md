# Oumla SDK

Oumla SDK is the fastest way to build in the blockchain. It enables you to generate wallets, addresses, and create transactions using our secure and scalable infrastructure.

## Available SDKs

### TypeScript SDK
```bash
npm install @oumla/sdk
```

[View TypeScript SDK Documentation](./sdks/typescript/README.md)

### Python SDK (Coming Soon)
```bash
pip install oumla-sdk-python
```

### Java SDK (Coming Soon)
```xml
<dependency>
    <groupId>com.oumla</groupId>
    <artifactId>sdk-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Quick Start

### TypeScript
```typescript
import { OumlaSdkApiClient } from '@oumla/sdk';

const client = new OumlaSdkApiClient({
  environment: 'production',
  apiKey: 'your-api-key'
});

const wallet = await client.wallets.create({
  reference: '0d2fcf49-36ce-4160-bbea-ead3887e1b26',
  network: 'ETH',
});
```

## Development

This repository contains multiple language SDKs generated from a single OpenAPI specification.

### Prerequisites
- Node.js 18+
- pnpm 8+

### Setup
```bash
pnpm install
pnpm generate  # Generate SDKs from OpenAPI spec
pnpm build     # Build all SDKs
```

### Adding New SDKs
1. Update `fern/generators.yml`
2. Run `pnpm generate`
3. Create SDK-specific `package.json` and `README.md`

## Publishing

### Manual Publishing (Current)
```bash
cd sdks/typescript
npm run build
npm publish
```

### Automated Publishing (Changeset Workflow)
```bash
pnpm changeset        # Create changeset
pnpm version          # Update versions
pnpm release          # Publish all packages
```

📖 **See [CHANGESET_WORKFLOW.md](./CHANGESET_WORKFLOW.md) for detailed instructions on automatic changelog generation and version management.**

## Documentation

For detailed documentation, please visit our [docs](https://docs.oumla.com).

## License

MIT
