// const del = require("del");
import del from 'del';

export default () => {
  try {
    del.sync("test/testProject1/graphQL");
    del.sync("test/testProject1_NewDriver/graphQL");
    del.sync("test/testProject2/graphQL");
    del.sync("test/testProject3/graphQL");
    del.sync("test/testProject4/graphQL");
    del.sync("test/testProject4_NewDriver/graphQL");
    del.sync("test/testProject5/graphQL");
    del.sync("test/testProject6/graphQL");
    del.sync("test/testProject7/graphQL");
    del.sync("test/testProject8/graphQL");
    del.sync("test/testProject9/graphQL");
    del.sync("test/testProject10/graphQL");
  } catch (e) {}
};
