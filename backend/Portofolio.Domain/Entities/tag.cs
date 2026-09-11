namespace Portofolio.Domain.Entities;

public class Tag
{
    public Guid Id {get; set;} = Guid.NewGuid();
    public string Name = string.Empty;
    public string Slug = string.Empty;

    public ICollection<Project> Projects {get; set;} = new List<Project>();
    public ICollection<Devlog> Devlogs {get; set;} = new List<Devlog>();
    public ICollection<Illustration> Illustrations {get; set;} = new List<Illustration>();
}