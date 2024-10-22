import { Field, ZkProgram } from "o1js";

export const ZkGuessNumber = ZkProgram({
  name: "guess-number",

  methods: {
    guess: {
      privateInputs: [Field],
      async method(guess: Field) {
        guess.assertEquals(Field(42));
      },
    },
  },
});

export async function pipelineLight(log: (message: string) => void) {
  log("compiling");
  await ZkGuessNumber.compile();

  log("proving");
  await ZkGuessNumber.guess(Field(42));
  log("proved");
}
