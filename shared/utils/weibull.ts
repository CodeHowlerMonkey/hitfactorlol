import * as ss from "simple-statistics";

const DEFAULT_PRECISION = 5;

const optimize = (lossFn, start, precision = DEFAULT_PRECISION) => {
  let bestParams = start;
  let bestLoss = lossFn(start);
  const step = 0.5 / precision;
  for (let i = -precision; i <= precision; i++) {
    for (let j = -precision; j <= precision; j++) {
      const testParams = [bestParams[0] + i * step, bestParams[1] + j * step];
      const loss = lossFn(testParams);
      if (loss < bestLoss) {
        bestLoss = loss;
        bestParams = testParams;
      }
    }
  }
  return bestParams;
};

const probabilityDistributionFn = (x: number, k: number, lambda: number): number =>
  (k / lambda) * Math.pow(x / lambda, k - 1) * Math.exp(-Math.pow(x / lambda, k));

const lossFnFactory =
  (data: number[]) =>
  ([k, lambda]: [number, number]) =>
    data.reduce(
      (sum, x) => sum - Math.log(probabilityDistributionFn(x, k, lambda) || 1e-10),
      0,
    );

const findParams = (data, precision) => {
  if (!data) {
    return [1, 1];
  }
  const mean = ss.mean(data);
  const variance = ss.variance(data);

  return optimize(lossFnFactory(data), [mean ** 2 / variance, mean], precision);
};

/**
 * Fits Weibull distribution to provided dataset and returns an bucket of stuff:
 *  - Cumulative Distribution Function y(x) and it's reverse x(y)
 *  - fitted k & lambda params for Weibull Distribution
 *  - Recommended HHFs, using 99th/95%, 95th/85% and 85th/75% targets
 *
 * @param dataPoints array of hit-factor scores
 *
 * @param precision positive integer, the square of this number controls the
 * number of iterations when optimizing weibull params trying to minimize loss.
 */
export const solveWeibull = (
  dataPoints: number[],
  precision: number = DEFAULT_PRECISION,
) => {
  const [k, lambda] = findParams(dataPoints, precision);

  const cdf = x => 100 - 100 * (1 - Math.exp(-Math.pow(x / lambda, k)));
  const reverseCDF = y => lambda * Math.pow(Math.log(100 / y), 1 / k);
  const hhf1 = reverseCDF(1) / 0.95;
  const hhf5 = reverseCDF(5) / 0.85;
  const hhf15 = reverseCDF(15) / 0.75;

  return { k, lambda, cdf, reverseCDF, hhf1, hhf5, hhf15 };
};
