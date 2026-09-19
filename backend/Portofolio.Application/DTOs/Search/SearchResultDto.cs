using Portofolio.Application.DTOs.Devlogs;
using Portofolio.Application.DTOs.Illustrations;
using Portofolio.Application.DTOs.Projects;

namespace Portofolio.Application.DTOs.Search;

public class SearchResultsDto
{
    public string Query { get; set; } = string.Empty;
    public int TotalResults => Projects.Count + Devlogs.Count + Illustrations.Count;
    public List<ProjectDto> Projects { get; set; } = new();
    public List<DevlogDto> Devlogs { get; set; } = new();
    public List<IllustrationDto> Illustrations { get; set; } = new();
}

public class TagDetailDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public List<ProjectDto> Projects { get; set; } = new();
    public List<DevlogDto> Devlogs { get; set; } = new();
    public List<IllustrationDto> Illustrations { get; set; } = new();
}

public class TagSummaryDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int UsageCount { get; set; }
}