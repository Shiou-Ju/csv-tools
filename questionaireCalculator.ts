import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import _ from 'lodash';
import * as dotenv from 'dotenv';

dotenv.config();

const { QUESTIONAIRE_FOLDER, FILE_NAME } = process.env;

type choices = '1' | '2' | '';
type selection = '1' | '2' | '3';

type row = {
  no: string;
  Ans: selection;
  A: choices;
  B: choices;
  C: choices;
};

const answers = [] as row[];
const mapper = {
  pointA: 0,
  pointB: 0,
  pointC: 0,
};

const isSelectTionType = (input: string): input is selection => {
  return ['1', '2', '3'].includes(input);
};

const isChoiceType = (input: string): input is choices => {
  return ['1', '2', ''].includes(input);
};

const processRow = (row: row) => {
  answers.push(row);

  const { no, Ans, A, B, C } = row;

  const wrongSelectionType = !isSelectTionType(Ans);

  if (wrongSelectionType) {
    throw new Error(
      `ans type error: the answer is ${Ans} at item no ${no}`
    );
  }

  const wrongChoiceType =
    !isChoiceType(A) || !isChoiceType(B) || !isChoiceType(C);

  if (wrongChoiceType) {
    throw new Error(
      `ans type error: the choice got something wrong at ${no}`
    );
  }

  if (Ans === A) mapper.pointA++;
  if (Ans === B) mapper.pointB++;
  if (Ans === C) mapper.pointC++;
};

fs.createReadStream(
  path.resolve(__dirname, QUESTIONAIRE_FOLDER as string, FILE_NAME as string)
)
  .pipe(csv.parse({ headers: true }))
  .on('error', (error) => console.error(error))
  .on('data', (row) => processRow(row))
  .on('end', () => {
    console.log(mapper);
  });
