/*!
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import NumberFormatter from './NumberFormatter';

export function formatNumber(
  val: string,
  maxFractionDigits?: number,
  minFractionDigits?: number,
): string {
  return NumberFormatter.formatNumber(val, maxFractionDigits, minFractionDigits);
}

export function formatPercent(
  val: string,
  maxFractionDigits?: number,
  minFractionDigits?: number,
): string {
  return NumberFormatter.formatPercent(val, maxFractionDigits, minFractionDigits);
}

export function formatCurrency(
  val: string,
  cur: string,
  maxFractionDigits?: number,
  minFractionDigits?: number,
): string {
  return NumberFormatter.formatCurrency(val, cur, maxFractionDigits, minFractionDigits);
}
