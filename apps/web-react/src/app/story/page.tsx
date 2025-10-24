/**
 * Story Engine Page component.
 * 
 * This component displays the story engine page, including the story state, options, events, and tools.
 * 
 * @returns The story engine page component.
 */
export default function StoryEnginePage() {
  // State and loading variables
  const [state, setState] = useState<StoryState | null>(null);
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tools, setTools] = useState<BridgeTool[]>([]);
  const [toolsLoading, setToolsLoading] = useState(true);
  const [toolsError, setToolsError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // Load story and tools
  const loadStory = useCallback(async () => {
    try {
      if (isMountedRef.current) {
        setLoading(true);
      }

      const [storyState, eventsData] = await Promise.all([
        bridgeClient.getStoryState(),
        bridgeClient.getStoryEvents(10)
      ]);

      if (isMountedRef.current) {
        setState(storyState);
        setEvents(Array.isArray(eventsData.events) ? eventsData.events : []);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load story');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const loadTools = useCallback(async () => {
    try {
      if (isMountedRef.current) {
        setToolsLoading(true);
      }

      const toolsList = await bridgeClient.listTools();

      if (isMountedRef.current) {
        setTools(toolsList);
        setToolsError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setToolsError(err instanceof Error ? err.message : 'Failed to load tools');
      }
    } finally {
      if (isMountedRef.current) {
        setToolsLoading(false);
      }
    }
  }, []);

  // Handle choose option and refresh
  const handleChooseOption = useCallback(
    async (optionId: string) => {
      try {
        await bridgeClient.chooseStoryOption(optionId);
        await loadStory();
      } catch (err) {
        console.error('Failed to choose option:', err);
      }
    },
    [loadStory]
  );

  const handleRefresh = useCallback(async () => {
    try {
      await bridgeClient.refreshStoryOptions(true);
      await loadStory();
    } catch (err) {
      console.error('Failed to refresh:', err);
    }
  }, [loadStory]);

  // Use effect to load story and tools on mount
  useEffect(() => {
    isMountedRef.current = true;
    loadStory();
    loadTools();

    const interval = setInterval(loadStory, 30000);
    const toolsInterval = setInterval(loadTools, 60000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
      clearInterval(toolsInterval);
    };
  }, [loadStory, loadTools]);

  // Render loading or error state
  if (loading && !state) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-muted-foreground">Loading Story Engine...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>❌ Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadStory}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render story engine page
  if (!state) return null;

  // Calculate resources and level
  const resourcesRaw = state.resources && typeof state.resources === 'object' ? state.resources : {};
  const resources = {
    energie: Number((resourcesRaw as Record<string, unknown>).energie) || 0,
    wissen: Number((resourcesRaw as Record<string, unknown>).wissen) || 0,
    inspiration: Number((resourcesRaw as Record<string, unknown>).inspiration) || 0,
    ruf: Number((resourcesRaw as Record<string, unknown>).ruf) || 0,
    stabilitaet: Number((resourcesRaw as Record<string, unknown>).stabilitaet) || 0,
    erfahrung: Number((resourcesRaw as Record<string, unknown>).erfahrung) || 0,
    level: Number((resourcesRaw as Record<string, unknown>).level) || 1
  };

  const level = resources.level || 1;
  const xpForNextLevel = Math.max(1, level * 100);
  const currentXP = resources.erfahrung || 0;
  const xpPercent = Math.min(100, (currentXP / xpForNextLevel) * 100);

  // Get options, companions, and buffs
  const options = Array.isArray(state.options) ? state.options : [];
  const companions = Array.isArray(state.companions) ? state.companions : [];
  const buffs = Array.isArray(state.buffs) ? state.buffs : [];

  // Sort tools
  const sortedTools = useMemo(() => {
    const unique = new Map<string, BridgeTool>();

    for (const tool of tools) {
      if (tool?.name && !unique.has(tool.name)) {
        unique.set(tool.name, tool);
      }
    }

    return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tools]);

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📖 Story Engine</h1>
          <p className="text-muted-foreground">
            Arc: {state.arc} · Level {level}
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          🔄 Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="options">Options ({options.length})</TabsTrigger>
          <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
          <TabsTrigger value="tools">Tools ({sortedTools.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Epoch</span>
                    <Badge>{state.epoch}</Badge>
                  </div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Arc</span>
                    <Badge variant="secondary">{state.arc}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <Badge variant="default">{level}</Badge>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">XP to Level {level + 1}</span>
                    <span className="text-sm">{currentXP.toFixed(0)} / {xpForNextLevel}</span>
                  </div>
                  <Progress value={xpPercent} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Resources Card */}
            <Card>
              <CardHeader>
                <CardTitle>💎 Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(resources)
                  .filter(([key]) => !['level', 'erfahrung'].includes(key))
                  .slice(0, 5)
                  .map(([key, val]) => {
                    const numVal = typeof val === 'number' ? val : 0;
                    const percent = Math.min(100, (numVal / 100) * 100);

                    return (
                      <div key={key}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="capitalize text-muted-foreground">{key}</span>
                          <span className="font-semibold">{numVal.toFixed(0)}</span>
                        </div>
                        <Progress value={percent} className="h-1" />
                      </div>
                    );
                  })}
              </CardContent>
            </Card>

            {/* Mood Card */}
            <Card>
              <CardHeader>
                <CardTitle>🌙 Mood & Companions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-lg font-semibold">{state.mood}</p>
                  <p className="text-sm text-muted-foreground">{state.arc}</p>
                </div>
                {companions.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Companions:</p>
                    <div className="flex flex-wrap gap-1">
                      {companions.map((companion, index) => (
                        <Badge key={index} variant="secondary">
                          {(companion as { name?: string }).name || (companion as string)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {buffs.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Buffs:</p>
                    <div className="space-y-1">
                      {buffs.map((buff, index) => (
                        <div key={index} className="text-sm">
                          ✨ {(buff as { name?: string }).name || (buff as string)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Options Tab */}
        <TabsContent value="options" className="space-y-4">
          {options.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="mb-4 text-muted-foreground">No active story options.</p>
                <Button onClick={handleRefresh}>Generate Options</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {options.map(option => (
                <Card
                  key={option.id}
                  className="cursor-pointer transition-shadow hover:shadow-lg"
                  onClick={() => handleChooseOption(option.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-base">{option.label}</CardTitle>
                    <CardDescription>{option.rationale || 'Choose this option'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {option.expected && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(option.expected).map(([key, value]) => (
                          <Badge key={key} variant={value > 0 ? 'default' : 'destructive'}>
                            {key}: {value > 0 ? '+' : ''}
                            {value}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          {events.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No events yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {events.map(evt => (
                <Card key={evt.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {evt.type === 'choice' ? '🎯' : evt.type === 'level_up' ? '⭐' : '📝'}{' '}
                        {evt.description || evt.label}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </CardHeader>
                  {evt.effects && (
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(evt.effects).map(([key, value]) => (
                          <Badge key={key} variant={value > 0 ? 'default' : 'secondary'}>
                            {key}: {value > 0 ? '+' : ''}
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-4">
          {toolsLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Loading tools...</p>
              </CardContent>
            </Card>
          ) : toolsError ? (
            <Card>
              <CardHeader>
                <CardTitle>Unable to load tools</CardTitle>
                <CardDescription>{toolsError}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={loadTools}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : sortedTools.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No MCP tools registered.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sortedTools.map(tool => {
                const schema = tool.inputSchema;
                const hasSchema = hasSchemaContent(schema);

                return (
                  <Card key={tool.name}>
                    <CardHeader>
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                      {tool.description && (
                        <CardDescription>{tool.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {schema && hasSchema ? (
                        <SchemaNode schema={schema} />
                      ) : (
                        <p className="text-sm text-muted-foreground">No input parameters.</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Checks if a schema has content.
 * 
 * @param schema The schema to check.
 * @returns True if the schema has content, false otherwise.
 */
function hasSchemaContent(schema?: BridgeToolSchema | null): boolean {
  if (!schema) {
    return false;
  }

  if (
    schema.description ||
    schema.default !== undefined ||
    schema.format ||
    schema.type ||
    (Array.isArray(schema.enum) && schema.enum.length > 0) ||
    (schema.properties && Object.keys(schema.properties).length > 0) ||
    schema.items ||
    (Array.isArray(schema.anyOf) && schema.anyOf.length > 0) ||
    (Array.isArray(schema.oneOf) && schema.oneOf.length > 0) ||
    (Array.isArray(schema.allOf) && schema.allOf.length > 0) ||
    typeof schema.additionalProperties !== 'undefined' ||
    (Array.isArray(schema.required) && schema.required.length > 0)
  ) {
    return true;
  }

  return false;
}

/**
 * Formats a schema value as a string.
 * 
 * @param value The value to format.
 * @returns The formatted value as a string.
 */
function formatSchemaValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (value === null) {
    return 'null';
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Failed to stringify schema value', error);
    return String(value);
  }
}

/**
 * Schema node component.
 * 
 * This component displays a schema node, including its properties and children.
 * 
 * @param props The component props.
 * @returns The schema node component.
 */
interface SchemaNodeProps {
  schema: BridgeToolSchema;
  depth?: number;
  name?: string;
  required?: boolean;
}

function SchemaNode({ schema, depth = 0, name, required = false }: SchemaNodeProps): JSX.Element | null {
  if (!schema) {
    return null;
  }

  const typeLabel = Array.isArray(schema.type) ? schema.type.join(' | ') : schema.type;
  const containerClass = cn(
    'space-y-2',
    depth > 0 && 'ml-4 rounded-md border border-dashed border-border/40 p-3'
  );
  const descriptionClass = cn('text-muted-foreground', depth > 0 ? 'text-xs' : 'text-sm');
  const metadataTextClass = depth > 0 ? 'text-[11px]' : 'text-xs';
  const sectionLabelClass = cn(
    'font-medium uppercase tracking-wide text-muted-foreground',
    depth > 0 ? 'text-[11px]' : 'text-xs'
  );
  const requiredSet = new Set(schema.required ?? []);
  const propertyEntries = schema.properties ? Object.entries(schema.properties) : [];

  return (
    <div className={containerClass}>
      {(name || typeLabel || schema.format || schema.description) && (
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap gap-2">
            {name && <span className="font-medium">{name}</span>}
            {typeLabel && (
              <Badge variant="outline" className="font-normal capitalize">
                {typeLabel}
              </Badge>
            )}
            {schema.format && (
              <Badge variant="outline" className="font-normal">
                {schema.format}
              </Badge>
            )}
            {required && <Badge variant="secondary">Required</Badge>}
          </div>
          {schema.description && <p className={descriptionClass}>{schema.description}</p>}
        </div>
      )}

      {schema.default !== undefined && (
        <p className={cn('text-muted-foreground', metadataTextClass)}>
          Default:{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-[11px]">
            {formatSchemaValue(schema.default)}
          </code>
        </p>
      )}

      {Array.isArray(schema.enum) && schema.enum.length > 0 && (
        <div className={cn('flex flex-wrap gap-1 text-muted-foreground', metadataTextClass)}>
          {schema.enum.map((value, index) => (
            <span key={index} className="rounded bg-muted px-2 py-0.5">
              {formatSchemaValue(value)}
            </span>
          ))}
        </div>
      )}

      {propertyEntries.length > 0 && (
        <div className="space-y-2">
          <p className={sectionLabelClass}>Fields</p>
          <div className="space-y-2">
            {propertyEntries.map(([key, propSchema]) => (
              <SchemaNode
                key={key}
                schema={propSchema}
                depth={depth + 1}
                name={key}
                required={requiredSet.has(key)}
              />
            ))}
          </div>
        </div>
      )}

      {schema.items && (
        <div className="space-y-2">
          <p className={sectionLabelClass}>Items</p>
          <div className="space-y-2">
            {Array.isArray(schema.items)
              ? schema.items.map((itemSchema, index) => (
                  <SchemaNode
                    key={`item-${index}`}
                    schema={itemSchema}
                    depth={depth + 1}
                    name={`Variant ${index + 1}`}
                  />
                ))
              : (
                  <SchemaNode schema={schema.items} depth={depth + 1} name="Item" />
                )}
          </div>
        </div>
      )}

      {Array.isArray(schema.anyOf) && schema.anyOf.length > 0 && (
        <div className="space-y-2">
          <p className={sectionLabelClass}>Any of</p>
          <div className="space-y-2">
            {schema.anyOf.map((entry, index) => (
              <SchemaNode
                key={`anyOf-${index}`}
                schema={entry}
                depth={depth + 1}
                name={`Option ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {Array.isArray(schema.oneOf) && schema.oneOf.length > 0 && (
        <div className="space-y-2">
          <p className={sectionLabelClass}>One of</p>
          <div className="space-y-2">
            {schema.oneOf.map((entry, index) => (
              <SchemaNode
                key={`oneOf-${index}`}
                schema={entry}
                depth={depth + 1}
                name={`Option ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {Array.isArray(schema.allOf) && schema.allOf.length > 0 && (
        <div className="space-y-2">
          <p className={sectionLabelClass}>All of</p>
          <div className="space-y-2">
            {schema.allOf.map((entry, index) => (
              <SchemaNode
                key={`allOf-${index}`}
                schema={entry}
                depth={depth + 1}
                name={`Requirement ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {typeof schema.additionalProperties !== 'undefined' && (
        typeof schema.additionalProperties === 'boolean' ? (
          <p className={cn('text-muted-foreground', metadataTextClass)}>
            Additional properties {schema.additionalProperties ? 'allowed' : 'not allowed'}
          </p>
        ) : (
          <div className="space-y-2">
            <p className={sectionLabelClass}>Additional Properties</p>
            <SchemaNode
              schema={schema.additionalProperties as BridgeToolSchema}
              depth={depth + 1}
            />
          </div>
        )
      )}
    </div>
  );
}