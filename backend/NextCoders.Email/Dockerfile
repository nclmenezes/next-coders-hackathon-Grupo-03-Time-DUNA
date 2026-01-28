FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# 1. Copia o arquivo do projeto usando o nome que vi na sua imagem
COPY NextCoders.EmailAPI.csproj ./
RUN dotnet restore

# 2. Copia todo o resto (Program.cs, Controllers, etc)
COPY . ./
RUN dotnet publish NextCoders.EmailAPI.csproj -c Release -o out

# 3. Estágio de Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# 4. Usa o nome EXATO do arquivo que vi na imagem
ENTRYPOINT ["dotnet", "NextCoders.EmailAPI.dll"]