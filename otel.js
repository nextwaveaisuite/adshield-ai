/**
 * Minimal OpenTelemetry boot for Node (Next.js). Optional.
 * Exports traces via OTLP HTTP; works with Datadog when routed correctly.
 * Configure:
 *   OTEL_EXPORTER_OTLP_ENDPOINT=https://api.datadoghq.com
 *   DD_API_KEY=...
 *   DD_SITE=datadoghq.com
 */
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const headers = {};
if (process.env.DD_API_KEY) headers['DD-API-KEY'] = process.env.DD_API_KEY;
if (process.env.DD_SITE) headers['DD-SITE'] = process.env.DD_SITE;

const exporter = new OTLPTraceExporter({
  url: (process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'https://api.datadoghq.com') + '/api/v2/spans',
  headers
});

const sdk = new NodeSDK({
  traceExporter: exporter
});

sdk.start().catch(()=>{});

process.on('beforeExit', async () => { try { await sdk.shutdown(); } catch(e){} });