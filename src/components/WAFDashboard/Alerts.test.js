import { normalizeAlert } from './Alerts';

describe('normalizeAlert', () => {
  it('preserves backend threat details and risk score', () => {
    const payload = {
      detected_threats: [
        'Disallowed HTTP method: PATCH',
        'Disabled API Access Attempt',
      ],
      final_risk_score: 41.99995865891852,
      id: 58,
      ip_address: '127.0.0.1',
      method: 'patch',
      request_status: 'blocked',
      timestamp: '2026-07-24T08:08:06.854710Z',
    };

    const normalized = normalizeAlert(payload, 0);

    expect(normalized.riskScore).toBe(41.99995865891852);
    expect(normalized.detectedThreats).toEqual(payload.detected_threats);
    expect(normalized.threat).toBe('Disallowed HTTP method: PATCH');
  });
});
