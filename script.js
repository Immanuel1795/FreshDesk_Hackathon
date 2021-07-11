
const domainName = window.localStorage.getItem("domain");
const apiKey = window.localStorage.getItem("api_key");

let base_url = `https://${domainName}.freshdesk.com/api/v2/`;
let headers = { Authorization: "Basic " + btoa(apiKey), 'content-type': 'application/json',};

let ticketRow = document.getElementById('tickets');
let selectTags = document.getElementsByTagName("select");

let contactRow = document.getElementById('contacts-table');
let contactArr = [];



document.getElementById('contact-container').classList.add('remove-container');
document.getElementById('add-container').classList.add('remove-container');

function displayContacts(){
document.getElementById('ticket-container').classList.add('remove-container');
document.getElementById('contact-container').classList.remove('remove-container');
document.getElementById('add-container').classList.add('remove-container');


}

function displayTickets(){
  document.getElementById('ticket-container').classList.remove('remove-container');
document.getElementById('contact-container').classList.add('remove-container');
document.getElementById('add-container').classList.add('remove-container');


}

function displayAdd(){
  document.getElementById('ticket-container').classList.add('remove-container');
  document.getElementById('contact-container').classList.add('remove-container');
  document.getElementById('add-container').classList.remove('remove-container');

}




async function getTickets() {
  try {
    let url = base_url + "tickets?include=description,requester&order_by=status";
    let data = await fetch(url, {
      method: "GET",
      headers,
    });
    
    let ticketData = await data.json();
    // console.log(ticketData)
    listTicket(ticketData)
    // ticketData.forEach(tickets=>{
    //     // console.log(tickets)
    //     listTicket(tickets)
    // })
  } catch (error) {
    console.log(error);
  }
}

getTickets();



async function listTicket(ticketData){

    console.log(ticketData);
    ticketData.forEach(tickets=>{
        let ticketElement = `
        <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-lg-2">
                   <h1 class="text-img"> ${tickets.requester.name.charAt(0)} </h1>
                </div>
                <div class="col-lg-8">
                    <h4> ${tickets.subject}</h4>
                    <p> ${tickets.description_text}</p>
                    <p><i class="far fa-envelope"></i> ${tickets.requester.name} • Created at ${moment(tickets.created_at).fromNow()}</p>
                </div>
                <div class="col-lg-2">


                <div class="categories">
                <div class="Priority">
                <select id="${tickets.id}" name="priority" class="custom-select">
                    <option value="1" ${tickets.priority === 1 && "Selected"}>Low</option>
                    <option value="2" ${tickets.priority === 2 && "Selected"}>Medium</option>
                    <option value="3" ${tickets.priority === 3 && "Selected"}>High</option>
                    <option value="4" ${tickets.priority === 4 && "Selected"}>Urgent</option>
                </select>
                </div>

                    <div class="Status">
                        <select id="${tickets.id}" name="status" class="custom-select">
                        <option value="2" ${tickets.status === 2 && "Selected"}>Open</option>
                    <option value="3" ${tickets.status === 3 && "Selected"}>Pending</option>
                    <option value="4" ${tickets.status === 4 && "Selected"}>Resolved</option>
                    <option value="5" ${tickets.status === 5 && "Selected"}>Closed</option>
                        </select>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    
    let divElement = document.createElement("div");
    divElement.innerHTML = ticketElement;
    ticketRow.appendChild(divElement);
    })
    
    for (i = 0; i < selectTags.length; i++) {
        // console.log(selectTags[i].name)
        
        selectTags[i].addEventListener("change", async function (e) {
            console.log(e.target.id, e.target.value, e.target.name)
            updateTicket(e.target.id, e.target.value, e.target.name);
           
        });
    }
    
  

}


async function updateTicket(id, value, name){
    console.log(id, value);
    try {
         
        let url = base_url + "tickets/" + id;
        if(name === "status"){
        fetch(url, {
          method: "PUT",
          headers,
          body: JSON.stringify({
              status: +value
            }),
        });
    } else if(name === "priority"){
        fetch(url, {
          method: "PUT",
          headers,
          body: JSON.stringify({
              priority: +value
            }),
        });
    } }
     catch (error) {
        console.log(error);
      }
}

getContact()
async function getContact() {
    try {
      let url = base_url + "contacts";
      let data = await fetch(url, {
        method: "GET",
        headers,
      });
      
      contactArr = await data.json();
       
      viewContact(contactArr)
    } catch (error) {
      console.log(error);
    }
  }

  

  function viewContact(contactData){
    let tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    contactData.forEach(contacts=>{
    let contactElement = `
    <td>${contacts.id || contacts.unique_external_id}</td>
    <td>${contacts.name}</td>
    <td>${contacts.email}</td>
    <td>${contacts.phone === null ? "---" : contacts.phone}</td>
    <td><button type="button" class="btn btn-outline-secondary text-center" onclick="getForm('${contacts.id}', '${contacts.name}', '${contacts.email}', '${contacts.phone === null ? "" : contacts.phone}', '${contacts.created_at}');" data-toggle="modal" data-target=".bd-example-modal-lg">Update</button></td>        
`;


      
      let tr = document.createElement("tr");
      tr.innerHTML = contactElement;
      tbody.append(tr);
      contactRow.append(tbody);

})
  }

  function getForm(id, name, email, phone){

    document.getElementById('contact-modal').classList.remove('remove-container');

      const modal = document.getElementById("contact-modal");
  modal.innerHTML = `
  <form id="details-form" class="detail-form">
        <div class="form-group" >
            <label for="ids">ID</label>
            <input type="text" class="form-control" id="ids" value=${id}>
          </div>

          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" value="${name}" id="name">
          </div>

        <div class="form-group">
          <label for="email">Email address</label>
          <input type="email" class="form-control" id="email" name="hi"value="${email}">
        </div>
        <div class="form-group">
          <label for="phone">Phone</label>
          <input type="text" class="form-control" id="phone" value="${phone}">
        </div>
        <button type="submit" class="btn btn-primary detail-submit">Submit</button>
      </form>
    
    
    `;

    document.getElementById("details-form").addEventListener("submit", (e) => {
        e.preventDefault();
    
        var details = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
          };
        
          console.log(details)
          updateContact(id, details);
    });

   

      
  }


async function updateContact(id, details){
    console.log(details)
    try {
        let url = base_url + "contacts/" + id;
        const updateElement = await fetch(url, {
          method: "PUT",
          headers,
          body: JSON.stringify(
              details
            ),
        });

        // swal("Succefully updated")
        // .then((value) => {
        //   window.location.reload();
        //   })
        const updtaedContacts = await updateElement.json();
        console.log(updtaedContacts.id)
        console.log(contactArr);
        
        contactArr = contactArr.filter(update=> update.id !== updtaedContacts.id);
         
          contactArr.unshift(updtaedContacts);
     
        viewContact(contactArr)
        swal("Updated", "", "success").then(value=>{
          document.getElementById('contact-modal').classList.add('remove-container');
        });



      } catch (error) {
        console.log(error);
      }

}

document.getElementById("add-form").addEventListener("submit", async (e) => {
  
  try {
    e.preventDefault();
  let contacts = {
    unique_external_id: document.getElementById("add-ids").value,
    name: document.getElementById("add-name").value,
    email: document.getElementById("add-email").value,
    phone: document.getElementById("add-phone").value,
    mobile: document.getElementById("add-mobile").value,
    twitter_id : document.getElementById("add-twitter").value,
  };

  console.log(contacts)
    let url = base_url + "contacts/";
    const addElement = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(
        contacts
        ),
    });

   
    const updEle = await addElement.json();
    console.log(updEle)
    
    if(updEle.errors){
      swal("Credentials should be unique","", "warning")
    } else {
      contactArr.unshift(updEle);
      viewContact(contactArr);
      swal("Successfully added","", "success").then(value=>{
        document.getElementById("add-form").reset();
      })
     
    }
     



  } catch (error) {
   console.log(error)
  }


  

});

function logout() {
  window.localStorage.removeItem("domain");
  window.localStorage.removeItem("api_key");
  window.location.href = "./login.html"
}












