import { Alert, Share } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Invoice } from '../store/reducer/invoice';
import { SettingsState } from './../store/reducer/settings';
import moment from 'moment';

export const getNameAvatar = (name: string) => {
  const avtrArr = name.match(/\b(\w)/g);
  if (!avtrArr) return name;
  const avtr = avtrArr.slice(0, 2).join('').toUpperCase();
  return avtr;
};

export const getCategoryStr = (cat: string) => {
  return cat.toUpperCase().replace(/_/g, ' ');
};

export const setCategoryStr = (cat: string) => {
  return cat.toLowerCase().trim().replace(/' '/g, '_');
};

export const capitalizeFirstWord = (sentence: string) => {
  const words = sentence.split(' ');

  return words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(' ');
};

export const formatMoney = (
  number: string,
  decPlaces: number = 2,
  decSep?: string,
  thouSep?: string
) => {
  (decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces),
    (decSep = typeof decSep === 'undefined' ? '.' : decSep);
  thouSep = typeof thouSep === 'undefined' ? ',' : thouSep;
  const sign = +number < 0 ? '-' : '$';
  const i = String(
    parseInt((number = Math.abs(Number(number) || 0).toFixed(decPlaces)))
  );

  var j: number = (j = i.length) > 3 ? j % 3 : 0;

  return (
    sign +
    (j ? i.substr(0, j) + thouSep : '') +
    i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, '$1' + thouSep) +
    (decPlaces
      ? decSep +
        Math.abs(+number - +i)
          .toFixed(decPlaces)
          .slice(2)
      : '')
  );
};

export const getInvoiceHTML = (curInv: Invoice, settings: SettingsState) => {
  const {
    address: oAddress,
    business_name: oBusinessName,
    hideFromInvoice,
    owner_name,
    phone: oPhone,
    email: oEmail,
    logo,
    website,
  } = settings;

  const html = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                padding: 50;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                justify-content: center;
                align-items: center;
                font-family: 'Courier New', Courier, monospace;
            }

            p {
                margin: 0;
            }

            .billto_info,
            .header_wrapper {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 100%;
            }

            .header_wrapper {}

            h2 {
                color: #000;
                text-transform: uppercase;
            }

            .reciever_info {
                width: 60%;
            }

            .invoice_info {
                width: 40%;
            }

            .company_info {
                width: 50%;
            }

            .company_logo {
                display: flex;
                vertical-align: middle;
                justify-content: center;
                align-items: center;
                width: 50%;
            }

            .company_logo img {}

            .table_wrapper {
                width: 100%;
            }

            .table_body {
                align-items: 'center';
                justify-content: center;
                justify-items: center;
                empty-cells: hide;
            }

            table {
                font-family: arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
            }

            td,
            th {
                border: 0.5px solid #ddd;
                text-align: left;
                padding: 8px;
                font-family: 'Courier New', Courier, monospace;
                text-align: center;
            }

            th {
                font-weight: bold;
                font-size: larger;
                text-transform: uppercase;
                color: #000;
            }

            tr:nth-child(odd) {}
        </style>
    </head>

    <body>
        <div class="header_wrapper">
            <div class="company_info">
                <h2>${oBusinessName}</h2>
                <p>${oAddress}</p>
                <p>${oEmail}</p>
                <p>+1 ${oPhone} </p>
            </div>
            <div class="company_logo">
                ${
                  hideFromInvoice
                    ? ``
                    : `<img
                      src="data:image/jpeg;base64,${logo}"
                      width='120'
                      height='120'
                      alt='Logo'></img>`
                }
            </div>
        </div>

        <br>

        <div class="billto_info">
            <div class="reciever_info">
                <h2>BILL TO</h2>
                <p>${curInv.customer.business_name}</p>
                <p>${curInv.customer.address}</p>

                <br>

                <p>+1 ${curInv.customer.phone}</p>
                <p>${curInv.customer.email}</p>
            </div>
            <div class="invoice_info">

                <h2>INVOICE DETAILS</h2>
                <p>Invoic Number: <strong style="color: #000;">#${
                  curInv.invoiceNumber
                }</strong></p>
                <p>Invoice Date: ${moment(curInv.invoiceDate).format(
                  'DD MMM, YYYY'
                )}</p>
                <p>Payment Status: <strong style="color: #000; text-transform: uppercase;">${
                  curInv.status
                }</strong></p>

                <br>

                <p>Notes: ${curInv.notes}</p>
            </div>
        </div>

        <br>

        <div class="table_wrapper">
            <div class="table_body">
                <table>
                    <tr style="background-color: #ddd;">
                        <th style="text-align: left;">Description</th>
                        <th>QTY</th>
                        <th>Unit Price</th>
                        <th style="text-align: right;">Total</th>
                    </tr>

                    ${curInv.invoiceItems
                      .map((inv, i) => {
                        return `
                          <tr>
                            <td style="text-align: left;">${i + 1}. ${
                          inv.name
                        }</td>
                            <td>${inv.quantity}</td>
                            <td>$${inv.unitPrice}</td>
                            <td style="text-align: right;">$${inv.itemTotal.toFixed(
                              2
                            )}</td>
                        </tr>
                        `;
                      })
                      .join(' ')}
                    
                    <tr style="background-color: white;">
                        <td colspan="3" style="text-align: right; border: none;">Discount</td>
                        <td style="text-align: right;">$${
                          curInv.discount?.toFixed(2) || '0.00'
                        }</td>
                    </tr>


                    <tr style="background-color: white;">
                        <td colspan="3" style="text-align: right; border: none;">Shipping Charge</td>
                        <td style="text-align: right;">$${
                          curInv.shippingCharge?.toFixed(2) || '0.00'
                        }</td>
                    </tr>


                    <tr style="background-color: white;">
                        <td colspan="3" style="text-align: right; border: none;">Subtotal</td>
                        <td style="text-align: right;">$${curInv.subTotal.toFixed(
                          2
                        )}</td>
                    </tr>


                    <tr style="background-color: white;">
                        <td colspan="3" style="text-align: right; border: none;">Tax</td>
                        <td style="text-align: right;">$${
                          curInv.tax?.toFixed(2) || '0.00'
                        }</td>
                    </tr>

                    <tr style="background-color: white;">
                        <td style="border: none; text-align: left;">Thank you for your business!</td>
                        <td colspan="2" style="text-align: right; border: none;">Total</td>
                        <td style="text-align: right; font-weight: bold; color: #000;">$${curInv.total.toFixed(
                          2
                        )}</td>
                    </tr>

                </table>
            </div>
        </div>
    </body>

    </html>
    `;
  return html;
};

export const getCapitalizeSentence = (
  sentence: string,
  joined: boolean = true
) => {
  const words = sentence
    .replace(/[^a-zA-Z ]/g, '')
    .trim()
    .split(' ');
  for (let i = 0; i < words.length; i++) {
    if (words[i]) {
      words[i] =
        words[i][0].toUpperCase() + words[i].substring(1, words[i].length);
    }
  }

  const capitalizedSencence = joined ? words.join('') : words.join(' ');

  return capitalizedSencence;
};
