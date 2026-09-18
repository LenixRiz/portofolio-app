using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portofolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNavigationPropertiesAndJoinTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Devlogs_Tags_TagId",
                table: "Devlogs");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Tags_TagId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_TagId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Devlogs_TagId",
                table: "Devlogs");

            migrationBuilder.DropColumn(
                name: "TagId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "TagId",
                table: "Devlogs");

            migrationBuilder.CreateTable(
                name: "DevlogTag",
                columns: table => new
                {
                    DevlogsId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DevlogTag", x => new { x.DevlogsId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_DevlogTag_Devlogs_DevlogsId",
                        column: x => x.DevlogsId,
                        principalTable: "Devlogs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DevlogTag_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectTag",
                columns: table => new
                {
                    ProjectsId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTag", x => new { x.ProjectsId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_ProjectTag_Projects_ProjectsId",
                        column: x => x.ProjectsId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectTag_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DevlogTag_TagsId",
                table: "DevlogTag",
                column: "TagsId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTag_TagsId",
                table: "ProjectTag",
                column: "TagsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DevlogTag");

            migrationBuilder.DropTable(
                name: "ProjectTag");

            migrationBuilder.AddColumn<Guid>(
                name: "TagId",
                table: "Projects",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TagId",
                table: "Devlogs",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_TagId",
                table: "Projects",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_Devlogs_TagId",
                table: "Devlogs",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_Devlogs_Tags_TagId",
                table: "Devlogs",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Tags_TagId",
                table: "Projects",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id");
        }
    }
}
