import { defineEval, includes } from "@cursor/bdk/evals";

export default defineEval({
  tags: ["smoke", "brief"],
  cases: [
    {
      id: "create-brief-and-estimate",
      description:
        "Creates a CLS brief and a linked work estimate for a voice screen-pop engagement.",
      async test(t) {
        await t.send(
          "Create a draft consultancy brief for Care Hub Salesforce Voice screen-pop: problem is agents lack context on inbound calls; outcome is faster first-contact resolution with context before conversation. Add principles, scope, success signals. Then size Discovery, Design, Build, and Enablement streams with day buckets and 15% contingency. Do not export files yet.",
        );
        t.succeeded();
        t.calledTool("upsert_brief");
        t.calledTool("upsert_estimate");
        t.check(t.reply, includes(/brief|estimate|day/i));
      },
    },
  ],
});
