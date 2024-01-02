const { query } = require('./db');

async function getmanagements() {
  const data = await query("SELECT * FROM managementdata");
  return { data };
}

async function insertmanagements(params) {
  
  const { name, phone, email, address } = params;
  console.log(">>>>>> INSERT INTO managementdata(name, phone, email, address) VALUES(?, ?, ?, ?)", [name, phone, email, address]);
  const result = await query("INSERT INTO managementdata(name, phone, email, address) VALUES(?, ?, ?, ?)", [name, phone, email, address]);

  let message = "";
  let success = "";

  if (result.affectedRows) {
    message = 'Add successfully';
    success = 'success';
  } else {
    message = 'Add failed';
    success = 'error';
  }

  return { message, success };
}

async function updatemanagements(id, params) {
  const { name, phone, email, address } = params;
  const result = await query("UPDATE managementdata SET name=?, phone=?, email=?, address=? WHERE id=?", [name, phone, email, address, id]);

  let message = "";
  let status = "";
   if (result.affectedRows) {
    message = 'Updated successfully';
    status = 'success';
  } else {
    message = 'Not updated!';
    status = 'Error';
  }
    return { message, status };
}
async function deletemanagements(id) {
 const result = await query("DELETE FROM managementdata WHERE id = ?", [id]);

 let message = "";
 let status = "";

 if (result.affectedRows) {
   message = 'Record deleted successfully';
   status = 'success';
 } else {
   message = 'Record not deleted';
   status = 'error';
 }

 return { message, status };
}


module.exports = { getmanagements, insertmanagements, updatemanagements, deletemanagements };
