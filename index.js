'use strict'
import Papa from 'papaparse'

export const convertDateForApi = (date) => {
    const dateArr = date.split('/')
    let month = dateArr[0]
    let day = dateArr[1]
    let year = dateArr[2]

    if (day.length === 1) {
        day = `0${day}`
    }

    if (month.length === 1) {
        month = `0${month}`
    }

    if (year.length < 4) {
        year = `20${year}`
    }

    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
}

const removeEmptyArrs = (data) => {
     for (let i = 0; i < data.length; i++) {
         if (data[i].length <= 1) {
             data.splice(i, 1)
         }
     }

     return data
 }

const convertToArrOfObjects = (data) => {
     removeEmptyArrs(data)

     const formattedData = data.map(function (x) {
         if (x[0].length === 0) {
             // eslint-disable-next-line
             return
         } else {
             const convertedDate = convertDateForApi(x[0])
             const tagList = x[7].split(' ')
             return {
                 date: convertedDate,
                 description: x[1],
                 original_description: x[2],
                 amount: x[3],
                 transaction_type: x[4],
                 category: x[5],
                 account: x[6],
                 tag_list: tagList,
                 notes: x[8],
             };
         }
     })

     return formattedData
 }


const parseCallback = function(data) {
    data.shift() // to remove header row
    var formattedData = convertToArrOfObjects(data)
    return formattedData
}

const parseMintCsv = (file) => {
    Papa.parse(file, {
        complete: function (results) {
            parseCallback(results.data);
        }
    });
}

 module.exports = parseMintCsv