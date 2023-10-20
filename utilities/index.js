const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul class="nav-list">';
  list +=
    '<li class="list-item"><a href="/" title="Home page" class="link">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li class="list-item">';
    list +=
      '<a class="link" href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

// /* **************************************
//  * Build the classification view HTML
//  * ************************************ */
// Util.buildClassificationGrid = async function (data) {
//   let grid;
//   if (data.length > 0) {
//     grid = '<ul id="inv-display">';
//     data.forEach((vehicle) => {
//       grid += "<li>";
//       grid +=
//         '<a href="../../inv/detail/' +
//         vehicle.inv_id +
//         '" title="View ' +
//         vehicle.inv_make +
//         " " +
//         vehicle.inv_model +
//         'details"><img src="' +
//         vehicle.inv_thumbnail +
//         '" alt="Image of ' +
//         vehicle.inv_make +
//         " " +
//         vehicle.inv_model +
//         ' on CSE Motors" /></a>';
//       grid += '<div class="namePrice">';
//       grid += "<hr />";
//       grid += "<h2>";
//       grid +=
//         '<a href="../../inv/detail/' +
//         vehicle.inv_id +
//         '" title="View ' +
//         vehicle.inv_make +
//         " " +
//         vehicle.inv_model +
//         ' details">' +
//         vehicle.inv_make +
//         " " +
//         vehicle.inv_model +
//         "</a>";
//       grid += "</h2>";
//       grid +=
//         "<span>$" +
//         new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
//         "</span>";
//       grid += "</div>";
//       grid += "</li>";
//     });
//     grid += "</ul>";
//   } else {
//     grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
//   }
//   return grid;
// };

Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display" class="inv-display">';
    data.forEach((vehicle) => {
      grid += `<li class="list-item" class="vehicle-classifiction">
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
        vehicle.inv_make
      } ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${
        vehicle.inv_make
      } ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
        <hr class="divider-line"/>
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
        vehicle.inv_make
      } ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(
            vehicle.inv_price
          )}</span>
        </div>
      </li>`;
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildVehicleDetails = async function (data) {
  let vehicle = data[0];
  let vehicleDetails;
  vehicleDetails = `<div class="detail-view">`;
  vehicleDetails += `<h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
  vehicleDetails += `<div class="details-container">`;
  vehicleDetails += `<div class="image-container">`;
  vehicleDetails += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" width="1000"/>`;
  vehicleDetails += `</div>`;
  vehicleDetails += `<div class="info-container">`;
  vehicleDetails += `<h3>${vehicle.inv_make} ${vehicle.inv_model} Details</h3>`;
  vehicleDetails += `<ul>`;
  vehicleDetails += `<li class="list-item price">Price: $${new Intl.NumberFormat(
    "en-US"
  ).format(vehicle.inv_price)}</li>`;
  vehicleDetails += `<li class="list-item">Description: ${vehicle.inv_description}</li>`;
  vehicleDetails += `<li class="list-item">Color: ${vehicle.inv_color}</li>`;
  vehicleDetails += `<li class="list-item">Miles: ${new Intl.NumberFormat(
    "en-US"
  ).format(vehicle.inv_miles)}</li>`;
  vehicleDetails += `</ul>`;
  vehicleDetails += `</div>`;
  vehicleDetails += `</div>`;
  vehicleDetails += `</div>`;
  return vehicleDetails;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
