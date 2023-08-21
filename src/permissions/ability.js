import { AbilityBuilder, PureAbility } from "@casl/ability";

export default function defineRulesFor(role) {
  const { can, rules } = new AbilityBuilder();

  switch (role) {
    case "SUPER_ADMIN":
      can(["read", "write", "update", "delete"], "dashboard");
      can(["read", "write", "update", "delete"], "project");
      can(["read", "write", "update", "delete", "status"], "task");
      can(["read", "write", "update", "delete"], "rating");
      can(["read", "write", "update", "delete"], "team");
      can(["read", "write", "update", "delete"], "team-report");

      break;

    case "ADMIN":
      can(["read", "write", "update", "delete"], "dashboard");
      can(["read", "write", "update", "delete"], "project");
      can(["read", "write", "update", "delete","status"], "task");
      can(["read", "write", "update", "delete"], "rating");
      can(["read", "write", "update", "delete"], "team");
      can(["read", "write", "update", "delete"], "team-report");
      break;

    case "LEAD":
      can(["read", "write", "update", "delete"], "dashboard");
      can(["read", "write", "update", "delete"], "project");
      can(["read", "write", "update", "delete", "status"], "task");
      can(["read", "write", "update", "delete"], "rating");
      can(["read", "write", "update", "delete"], "team");
      can(["read", "write", "update", "delete"], "team-report");
      break;

    case "CONTRIBUTOR":
      can(["read", "write", "update", "delete"], "dashboard");
      can(["read", "write", "update", "delete"], "project");
      can(["read", "write", "update", "delete", "status"], "task");
      can(["read", "write", "update", "delete"], "rating");
      can(["read", "write", "update", "delete"], "team");
      can(["read", "write", "update", "delete"], "team-report");
      break;

    case "GUEST":
      can(["read", "write", "update", "delete"], "dashboard");
      can(["read", "write", "update", "delete"], "project");
      can(["read", "write", "update", "delete", "status"], "task");
      can(["read", "write", "update", "delete"], "rating");
      can(["read", "write", "update", "delete"], "team");
      can(["read", "write", "update", "delete"], "team-report");
  }

  return rules;
}

export function buildAbilityFor(role) {
  return new PureAbility(defineRulesFor(role), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    detectSubjectType: (object) => object.type,
  });
}
