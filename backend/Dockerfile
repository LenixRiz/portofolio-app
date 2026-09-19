# Stage 1: Build & Restore Environment
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Salin seluruh berkas .csproj terlebih dahulu untuk optimasi Docker layer caching
COPY ["Portofolio.Domain/Portofolio.Domain.csproj", "Portofolio.Domain/"]
COPY ["Portofolio.Application/Portofolio.Application.csproj", "Portofolio.Application/"]
COPY ["Portofolio.Infrastructure/Portofolio.Infrastructure.csproj", "Portofolio.Infrastructure/"]
COPY ["Portofolio.Api/Portofolio.Api.csproj", "Portofolio.Api/"]

# Restore dependensi NuGet
RUN dotnet restore "Portofolio.Api/Portofolio.Api.csproj"

# Salin seluruh sisa kode sumber
COPY . .

# Kompilasi dan rilis biner produksi
WORKDIR "/src/Portofolio.Api"
RUN dotnet publish "Portofolio.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime Image Ringan
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Buat direktori penyimpanan statis untuk volume mount
RUN mkdir -p /app/wwwroot/uploads /app/wwwroot/docs

# Salin artefak biner dari stage build
COPY --from=build /app/publish .

# Port default .NET 8/9 pada kontainer non-root
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Portofolio.Api.dll"]