export const tickets = [
    {
        routes: [
          {
            id: '048A', name: 'Bến thành - Suối tiên',
            legs: [
              {
                 stationFrom: 'Bến thành',
                 stationTo: 'Suối tiên'
              },     
            ],
            duration: '30 phút',
            returnDuration: '11:30'
          }
        ],
        price: 38,
        icons: ['wifi', 'moon', 'cup', 'rocket']
    },

    {
        routes: [
          {
            id: '048A', name: 'Bến thành - Suối tiên',
            legs: [
              {
                
                stationFrom: 'Bến thành',
                stationTo: 'Suối tiên'
              }
            ],
            duration: '30 phút',
            returnDuration: '30 phút'
          },
          {
            id: '085A', name: 'Suối tiên - Biên hoà',
            legs: [{
              stationFrom: 'Suối tiên',
              stationTo: 'Biên hoà'
            }
            ],
            duration: '30 phút',
            returnDuration: '30 phút'
  
          }
        ],
        price: 45,
        icons: ['wifi', 'cup']
    },
      
];