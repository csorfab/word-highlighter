const {
  renderHtmlInner,
  parseLine,
} = require('./renderer');

describe('renderer', () => {
  // describe('renderHtmlInner', () => {
  //   it('should render correctly', () => {
  //     const code = '#1{Hello} #2{World}';
  //     const actual = renderHtmlInner([], code);
  //     expect(actual).toMatchInlineSnapshot('"#1{HELLO} #2{WORLD}"');
  //   });
  // });
  describe('parseLine', () => {
    it('happy path: TBTBT', () => {
      const line = 'Text 0 #1{Text 1} Text 2 #2{Text 3} Text 4';
      const parsed = parseLine(line);
      const expected = [
        {
          type: 'T',
          value: 'Text 0 ',
        },
        {
          type: 'B',
          number: '1',
          value: 'Text 1',
        },
        {
          type: 'T',
          value: ' Text 2 ',
        },
        {
          type: 'B',
          number: '2',
          value: 'Text 3',
        },
        {
          type: 'T',
          value: ' Text 4',
        },
      ];
      expect(parsed).toEqual(expected);
    });
    it('happy path: BTB', () => {
      const line = '#1{Text 1} Text 2 #2{Text 3}';
      const parsed = parseLine(line);
      const expected = [
        {
          type: 'B',
          number: '1',
          value: 'Text 1',
        },
        {
          type: 'T',
          value: ' Text 2 ',
        },
        {
          type: 'B',
          number: '2',
          value: 'Text 3',
        },
      ];
      expect(parsed).toEqual(expected);
    });
    it('happy path: TBT', () => {
      const line = 'Text 0 #1{Text 1} Text 2';
      const parsed = parseLine(line);
      const expected = [
        {
          type: 'T',
          value: 'Text 0 ',
        },
        {
          type: 'B',
          number: '1',
          value: 'Text 1',
        },
        {
          type: 'T',
          value: ' Text 2',
        },
      ];
      expect(parsed).toEqual(expected);
    });
    it('happy path: T', () => {
      const line = 'Text';
      const parsed = parseLine(line);
      const expected = [
        {
          type: 'T',
          value: 'Text',
        },
      ];
      expect(parsed).toEqual(expected);
    });
    it('happy path: B', () => {
      const line = '#1{Text 1}';
      const parsed = parseLine(line);
      const expected = [
        {
          type: 'B',
          number: '1',
          value: 'Text 1',
        },
      ];
      expect(parsed).toEqual(expected);
    });
    it('number missing', () => {
      const line = '#{Text 1}';
      const parsed = parseLine(line);
      const expected = [
        {
          type: 'T',
          value: '#{Text 1}',
        },
      ];
      expect(parsed).toEqual(expected);
    });
    it('unbalanced brackets {', () => {
      const line = '#1{{{Text 1}';
      const parsed = parseLine(line);
      const expected = [
        {
          type: 'B',
          number: '1',
          value: '{{Text 1',
        },
      ];
      expect(parsed).toEqual(expected);
    });
    it('unbalanced brackets }', () => {
      const line = '#1{Text 1}}} foo';
      const parsed = parseLine(line);
      const expected = [
        {
          type: 'B',
          number: '1',
          value: 'Text 1',
        },
        {
          type: 'T',
          value: '}} foo',
        },
      ];
      expect(parsed).toEqual(expected);
    });
    it('missing bang #', () => {
      const line = '1{Text 1} foo';
      const parsed = parseLine(line);
      const expected = [
        {
          type: 'T',
          value: '1{Text 1} foo',
        },
      ];
      expect(parsed).toEqual(expected);
    });
  });
});
