import globalSchemaTypes from "./globalSchemaTypes";

export default function createTestSchema(names, namesWithTables, namesWithoutTables, writeableNames, types) {
  let schemaImports = namesWithTables
    .map(n => `import { query as ${n}Query, mutation as ${n}Mutation, type as ${n}Type } from './${n}/schema';`)
    .concat(namesWithoutTables.map(n => `import { type as ${n}Type } from './${n}/schema';`))
    .join("\n");
  // console.log({types})
  return `
  import { rawRequest } from "graphql-request"
  const endpoint = "http://localhost:8080/graphql"

  async function processQuery(query,name,fields) {
    return new Promise((resolve,reject) => {
    console.log(\`doing \${name}\`)

    const { data, errors, extensions, headers, status } = await rawRequest(
      endpoint,
      query
    )
    if(status===200){
      console.log(name+"passed")
      resolve(name)
    } else {

    
    console.error(
      JSON.stringify({ fields,name, errors, extensions, headers, status })
    )
    reject(errors)
    }
    })
  }
const runQueries = async () => {
    ${namesWithTables
      .map(n => {
        const a = types.filter(t => t.__name === n);
        // console.log({n,f:a[0].fields})
        const fields = a[0].fields;
        //      const fieldNames = Object.keys(fields)
        const recursedFields = [];
        const manualQueryArgs = [];
        Object.keys(fields).forEach(k => {
          //  recursedFields.push(...queriesForField(k, fields[k]));
          // console.log(k, fields[k])
          if (fields[k].__isArray) {
            recursedFields.push(`${k} {${Object.keys(fields[k].type.fields)}}`);
          } else {
            recursedFields.push(k);
          }
          switch (fields[k]) {
            default:
          }
          if (Array.isArray(fields[k].manualQueryArgs)) {
            manualQueryArgs.push(...fields[k].manualQueryArgs.map(arg => `${arg.name}: ${arg.type}`));
          }
          // fieldType(fields[k])
          //  let dateFields = Object.keys(fields).filter(k => fields[k] === DateType || (typeof fields[k] === "object" && fields[k].__isDate));
        });
        // console.table(manualQueryArgs)
        console.table(recursedFields);
        const fieldNames = recursedFields.join(" ");
        return `await processQuery(\`{all${n}s(LIMIT:1){${n}s{${fieldNames}}}}\`,"${n}", "${fieldNames}")`;
      })
      .join(".catch((error) => console.error(error))")}
}
runQueries().catch((error) => console.error(error))
`;
}
