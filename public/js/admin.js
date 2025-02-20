'use strict';

document.addEventListener("DOMContentLoaded", function () { 
  let userURL = "/account/admin/getUsers";
  fetch(userURL)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw Error("Network response was not OK");
  })
  .then(data => {
    console.log(data);
    buildUserList(data);
  })
  .catch(error => {
    console.log('There was a problem: ', error.message);
  });
});


function buildUserList(data) { 
    let userDisplay = document.getElementById("userDisplay"); 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Name</th><th>Email</th><th>Role</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 
    dataTable += '<tbody>'; 
  
    data.forEach(user => { 
      dataTable += `<tr>
                      <td>${user.account_firstname} ${user.account_lastname}</td>
                      <td>${user.account_email}</td>
                      <td>${user.account_type}</td>
                      <td><a href='/account/admin/edit/${user.account_id}' title='Click to update'>Modify</a></td>
                      <td><a href='/account/admin/delete-confirm/${user.account_id}' title='Click to delete'>Delete</a></td>
                    </tr>`; 
    });
  
    dataTable += '</tbody>'; 
    userDisplay.innerHTML = dataTable; 
  }
  