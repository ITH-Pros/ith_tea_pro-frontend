import { AbilityBuilder, PureAbility } from "@casl/ability";

export default function defineRulesFor(role) {
  const { can, rules } = new AbilityBuilder();

  switch (role) {
    case "SUPER_ADMIN":
      can(
        [
          "analytics",
          "projectgrid",
          "projectlist",
          "overdiewwork",
          "mywork",
          "teamwork",
          "taskverification",
        ],
        "dashboard"
      );
      can(
        [
          "write",
          "update",
          "delete",
          "archivelist",
          "archiveproject",
          "addteam",
          "removeteam",
        ],
        "project"
      );
      can(
        [
          "edit",
          "addsection",
          "editsection",
          "copymove",
          "deletesection",
          "changestatus",
        ],
        "task"
      );
      can(["fillrating", "viewtaskpnmodal", "viewratingonmodal"], "rating");
      can(["read", "write", "update", "delete"], "team");
      can(["read", "write", "update", "delete"], "team-report");
      break;

    case "ADMIN":
      can(
        [
          "analytics",
          "projectgrid",
          "projectlist",
          "overdiewwork",
          "mywork",
          "teamwork",
          "taskverification",
        ],
        "dashboard"
      );
      can(
        [
          "write",
          "update",
          "delete",
          "archivelist",
          "archiveproject",
          "addteam",
          "removeteam",
        ],
        "project"
      );
      can(
        [
          "edit",
          "addsection",
          "editsection",
          "copymove",
          "deletesection",
          "changestatus",
        ],
        "task"
      );
      can(["fillrating", "viewtaskpnmodal", "viewratingonmodal"], "rating");
      can(["read", "write", "update", "delete"], "team");
      can(["read", "write", "update", "delete"], "team-report");
      break;

    case "LEAD":
      can(
        [
          "analytics",
          "projectgrid",
          "projectlist",
          "overdiewwork",
          "mywork",
          "teamwork",
          "taskverification",
        ],
        "dashboard"
      );
      can(
        [
          "write",
          "update",
          "delete",
          "archivelist",
          "archiveproject",
          "addteam",
          "removeteam",
        ],
        "project"
      );
      can(
        [
          "edit",
          "addsection",
          "editsection",
          "copymove",
          "deletesection",
          "changestatus",
        ],
        "task"
      );
      can(["fillrating", "viewtaskpnmodal", "viewratingonmodal"], "rating");
      can(["read", "write", "update", "delete"], "team");
      can(["read", "write", "update", "delete"], "team-report");
      break;

    case "CONTRIBUTOR":
      can(
        [
          "analytics",
          "projectgrid",
          "projectlist",
          "overdiewwork",
          "mywork",
          "teamwork",
          "taskverification",
        ],
        "dashboard"
      );
      can(
        [
          "write",
          "update",
          "delete",
          "archivelist",
          "archiveproject",
          "addteam",
          "removeteam",
        ],
        "project"
      );
      can(
        [
          "edit",
          "addsection",
          "editsection",
          "copymove",
          "deletesection",
          "changestatus",
        ],
        "task"
      );
      can(["fillrating", "viewtaskpnmodal", "viewratingonmodal"], "rating");
      can(["read", "write", "update", "delete"], "team");
      can(["read", "write", "update", "delete"], "team-report");
      break;

    case "GUEST":
      can(
        [
          "analytics",
          "projectgrid",
          "projectlist",
          "overdiewwork",
          "mywork",
          "teamwork",
          "taskverification",
        ],
        "dashboard"
      );
      can(
        [
          "write",
          "update",
          "delete",
          "archivelist",
          "archiveproject",
          "addteam",
          "removeteam",
        ],
        "project"
      );
      can(
        [
          "edit",
          "addsection",
          "editsection",
          "copymove",
          "deletesection",
          "changestatus",
        ],
        "task"
      );
      can(["fillrating", "viewtaskpnmodal", "viewratingonmodal"], "rating");
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
