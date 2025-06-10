export const tickets = [
    {
        routes: [
          {
            id: '048A', name: 'North Express',
            legs: [
              {
                depart: '8:30p', dateDepart: 'Feb 14 SUN', from: 'New York', stationFrom: 'Penn Station, NY',
                arrive: '2:50a', dateArrive: 'Feb 15 SUN', to: 'Los Angeles', stationTo: 'Union Station, CA'
              },
              {
                depart: '10:20p', dateDepart: 'Feb 18 THU', from: 'New York', stationFrom: 'Penn Station, NY',
                arrive: '9:50a', dateArrive: 'Feb 19 THU', to: 'Los Angeles', stationTo: 'Union Station, CA'
              }
            ],
            duration: '07:25',
            returnDuration: '11:30'
          }
        ],
        price: 38,
        icons: ['wifi', 'moon', 'cup', 'rocket']
      },
      {
        routes: [
          {
            id: '105A', name: 'Silver Arrow',
            legs: [
              {
                depart: '12:30a', dateDepart: 'Feb 14 SUN', from: 'New York', stationFrom: 'Penn Station, NY',
                arrive: '3:50p', dateArrive: 'Feb 15 SUN', to: 'Los Angeles', stationTo: 'Union Station, CA'
              }
            ],
            duration: '07:25',
            returnDuration: '11:30'
          },
          {
            id: '210B', name: 'Coastal Cruiser',
            legs: [{
              depart: '6:00a', dateDepart: 'Feb 15 MON', from: 'San Francisco', stationFrom: 'SF Central, CA',
              arrive: '12:15p', dateArrive: 'Feb 15 MON', to: 'Los Angeles', stationTo: 'Union Station, CA'
            }
            ],
            duration: '15:49',
            returnDuration: '14:49'
  
          }
        ],
        price: 45,
        icons: ['wifi', 'cup']
      },
      {
        routes: [
          {
            id: '036C', name: 'American Trains',
            legs: [
              {
                depart: '22:45', dateDepart: 'Feb 14 SUN', from: 'New York', stationFrom: 'Penn Station, NY',
                arrive: '14:34', dateArrive: 'Feb 15 SUN', to: 'Los Angeles', stationTo: 'Union Station, CA'
              }
            ],
            duration: '15:49',
            returnDuration: '11:55'
  
          }
        ],
        price: 22,
        icons: ['wifi', 'moon', 'cup']
      }
    ];