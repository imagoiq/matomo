/*!
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */
import NumberFormatter from './NumberFormatter';

const formats: any = {
  ar: {
    "patternNumber": "#,##0.###",
    "patternPercent": "#,##0%",
    "patternCurrency": "‏#,##0.00 ¤",
    "symbolPlus": "؜+",
    "symbolMinus": "؜-",
    "symbolPercent": "٪؜",
    "symbolGroup": "٬",
    "symbolDecimal": "٫"
  },
  be: {
    "patternNumber": "#,##0.###",
    "patternPercent": "#,##0 %",
    "patternCurrency": "#,##0.00 ¤",
    "symbolPlus": "+",
    "symbolMinus": "-",
    "symbolPercent": "%",
    "symbolGroup": " ",
    "symbolDecimal": ","
  },
  de: {
    "patternNumber": "#,##0.###",
    "patternPercent": "#,##0 %",
    "patternCurrency": "#,##0.00 ¤",
    "symbolPlus": "+",
    "symbolMinus": "-",
    "symbolPercent": "%",
    "symbolGroup": ".",
    "symbolDecimal": ","
  },
  en: {
    "patternNumber": "#,##0.###",
    "patternPercent": "#,##0%",
    "patternCurrency": "¤#,##0.00",
    "symbolPlus": "+",
    "symbolMinus": "-",
    "symbolPercent": "%",
    "symbolGroup": ",",
    "symbolDecimal": "."
  },
  he: {
    "patternNumber": "#,##0.###",
    "patternPercent": "#,##0%",
    "patternCurrency": "‏#,##0.00 ‏¤;‏-#,##0.00 ‏¤",
    "symbolPlus": "‎+",
    "symbolMinus": "‎-",
    "symbolPercent": "%",
    "symbolGroup": ",",
    "symbolDecimal": "."
  },
  hi: {
    "patternNumber": "#,##,##0.###",
    "patternPercent": "#,##,##0%",
    "patternCurrency": "¤#,##,##0.00",
    "symbolPlus": "+",
    "symbolMinus": "-",
    "symbolPercent": "%",
    "symbolGroup": ",",
    "symbolDecimal": "."
  },
  lt: {
    "patternNumber": "#,##0.###",
    "patternPercent": "#,##0 %",
    "patternCurrency": "#,##0.00 ¤",
    "symbolPlus": "+",
    "symbolMinus": "−",
    "symbolPercent": "%",
    "symbolGroup": " ",
    "symbolDecimal": ","
  },
};

describe('CoreHome/NumberFormatter', () => {

  const numberTestData: Array<Array<any>> = [
    // english formats
    ['en', 5, 0, 0, '5'],
    ['en', -5, 0, 3, '-5'],
    ['en', 5.299, 0, 0, '5'],
    ['en', 5.299, 3, 0, '5.299'],
    ['en', -50, 3, 3, '-50.000'],
    ['en', 5000, 0, 0, '5,000'],
    ['en', 5000000, 0, 0, '5,000,000'],
    ['en', -5000000, 0, 0, '-5,000,000'],

    // foreign languages
    ['ar', 51239.56, 3, 0, '51٬239٫56'],
    ['be', 51239.56, 3, 0, '51 239,56'],
    ['de', 51239.56, 3, 0, '51.239,56'],
    ['he', 152551239.56, 3, 0, '152,551,239.56'],
    ['he', -152551239.56, 3, 0, '‎-152,551,239.56'],
    ['hi', 152551239.56, 0, 0, '15,25,51,240'],
    ['lt', -152551239.56, 0, 0, '−152 551 240'],
  ];

  numberTestData.forEach((testdata) => {
    const [ lang, input, maxFractionDigits, minFractionDigits, expected ] = testdata;

    it(`should correctly format number with (${lang}, ${input}, ${maxFractionDigits}, ${minFractionDigits})`, () => {

      window.piwik.numbers = formats[lang];

      const result = NumberFormatter.formatNumber(input as number, maxFractionDigits as number, minFractionDigits as number);

      expect(result).toEqual(expected);
    })
  });

  const percentNumberTestData: Array<Array<any>> = [
    // english formats
    ['en', 5, 0, 0, '5%'],
    ['en', -5, 0, 3, '-5%'],
    ['en', 5.299, 0, 0, '5%'],
    ['en', 5.299, 3, 0, '5.299%'],
    ['en', -50, 3, 3, '-50.000%'],
    ['en', -50, 1, 1, '-50.0%'],
    ['en', -50.1, 3, 3, '-50.100%'],
    ['en', 5000, 0, 0, '5,000%'],
    ['en', +5000, 0, 0, '5,000%'],
    ['en', 5000000, 0, 0, '5,000,000%'],
    ['en', -5000000, 0, 0, '-5,000,000%'],

    // foreign languages
    ['ar', 51239.56, 3, 0, '51٬239٫56٪؜'],
    ['be', 51239.56, 3, 0, '51 239,56 %'],
    ['de', 51239.56, 3, 0, '51.239,56 %'],
    ['he', 152551239.56, 3, 0, '152,551,239.56%'],
    ['hi', 152551239.56, 0, 0, '15,25,51,240%'],
    ['lt', -152551239.56, 0, 0, '−152 551 240 %'],
  ];

  percentNumberTestData.forEach((testdata) => {
    const [ lang, input, maxFractionDigits, minFractionDigits, expected ] = testdata;

    it(`should correctly format percent with (${lang}, ${input}, ${maxFractionDigits}, ${minFractionDigits})`, () => {

      window.piwik.numbers = formats[lang];

      const result = NumberFormatter.formatPercent(input as number, maxFractionDigits as number, minFractionDigits as number);

      expect(result).toEqual(expected);
    })
  });

  const currencyTestData: Array<Array<any>> = [
    // english formats
    ['en', 5, '$', 0, 0, '$5'],
    ['en', -5, '$', 0, 3, '-$5'],
    ['en', 5.299, '$', 0, 0, '$5'],
    ['en', 5.299, '$', 3, 0, '$5.299'],
    ['en', -50, '$', 3, 3, '-$50.000'],
    ['en', -50, '$', 1, 1, '-$50.0'],
    ['en', -50.1, '$', 3, 3, '-$50.100'],
    ['en', 5000, '$', 0, 0, '$5,000'],
    ['en', +5000, '$', 0, 0, '$5,000'],
    ['en', 5000000, '$', 0, 0, '$5,000,000'],
    ['en', -5000000, '$', 0, 0, '-$5,000,000'],

    // foreign languages
    ['ar', 51239.56, '$', 3, 0, '‏51٬239٫56 $'],
    ['be', 51239.56, '$', 3, 0, '51 239,56 $'],
    ['de', 51239.56, '$', 3, 0, '51.239,56 $'],
    ['he', -152551239.56, '$', 3, 0, '‏‎-152,551,239.56 ‏$'],
    ['hi', 152551239.56, '$', 0, 0, '$15,25,51,240'],
    ['lt', -152551239.56, '$', 0, 0, '−152 551 240 $'],
  ];

  currencyTestData.forEach((testdata) => {
    const [ lang, input, currency, maxFractionDigits, minFractionDigits, expected ] = testdata;

    it(`should correctly format currency with (${lang}, ${input}, ${currency}, ${maxFractionDigits}, ${minFractionDigits})`, () => {

      window.piwik.numbers = formats[lang];

      const result = NumberFormatter.formatCurrency(input as number, currency as string, maxFractionDigits as number, minFractionDigits as number);

      expect(result).toEqual(expected);
    })
  });

  const evolutionTestData: Array<Array<any>> = [
    // english formats
    ['en', 5, 0, 0, '+5%'],
    ['en', -5, 0, 3, '-5%'],
    ['en', 5.299, 0, 0, '+5%'],
    ['en', 5.299, 3, 0, '+5.299%'],
    ['en', -50, 3, 3, '-50.000%'],
    ['en', -50, 1, 1, '-50.0%'],
    ['en', -50.1, 3, 3, '-50.100%'],
    ['en', 5000, 0, 0, '+5,000%'],
    ['en', +5000, 0, 0, '+5,000%'],
    ['en', 5000000, 0, 0, '+5,000,000%'],
    ['en', -5000000, 0, 0, '-5,000,000%'],

    // foreign languages
    ['ar', 51239.56, 3, 0, '؜+51٬239٫56٪؜'],
    ['be', 51239.56, 3, 0, '+51 239,56 %'],
    ['de', 51239.56, 3, 0, '+51.239,56 %'],
    ['he', 152551239.56, 3, 0, '‎+152,551,239.56%'],
    ['hi', 152551239.56, 0, 0, '+15,25,51,240%'],
    ['lt', -152551239.56, 0, 0, '−152 551 240 %'],
  ];

  evolutionTestData.forEach((testdata) => {
    const [ lang, input, maxFractionDigits, minFractionDigits, expected ] = testdata;

    it(`should correctly format evolution with (${lang}, ${input}, ${maxFractionDigits}, ${minFractionDigits})`, () => {

      window.piwik.numbers = formats[lang];

      const result = NumberFormatter.formatEvolution(input as number, maxFractionDigits as number, minFractionDigits as number);

      expect(result).toEqual(expected);
    })
  });

});
