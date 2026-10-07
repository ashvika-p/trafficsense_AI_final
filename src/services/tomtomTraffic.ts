export interface TomTomFlowSegment {
  currentSpeed: number;
  freeFlowSpeed: number;
  currentTravelTime: number;
  freeFlowTravelTime: number;
  confidence: number;
  roadClosure: boolean;
}

interface TomTomFlowResponse {
  flowSegmentData?: TomTomFlowSegment;
  detailedError?: { message?: string; code?: string };
}

/** Fetches the current TomTom speed sample for the road nearest a WGS84 point. */
export async function getTomTomFlowSegment(
  latitude: number,
  longitude: number,
  apiKey: string,
): Promise<TomTomFlowSegment> {
  const query = new URLSearchParams({
    key: apiKey,
    point: `${latitude},${longitude}`,
    unit: 'kmph',
  });
  const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?${query.toString()}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });

  let body: TomTomFlowResponse;
  try {
    body = (await response.json()) as TomTomFlowResponse;
  } catch {
    throw new Error(`TomTom returned an unreadable response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(body.detailedError?.message || `TomTom request failed (HTTP ${response.status}).`);
  }
  if (!body.flowSegmentData) {
    throw new Error(body.detailedError?.message || 'No road-segment traffic sample was returned for this point.');
  }

  return body.flowSegmentData;
}
