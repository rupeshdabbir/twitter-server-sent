export const fields = [
    {
      name: "tweet",
      caption: "Field",
      operators: [
        {
          name: "=",
          caption: "Equals"
        },
        {
          name: "<>",
          caption: "RegEx"
        },
        {
          name: "()",
          caption: "Contains"
        }
      ]
    },
    {
        name: "lang",
        caption: "Field",
        operators: [
          {
            name: "=",
            caption: "Equals"
          },
          {
            name: "<>",
            caption: "RegEx"
          },
          {
            name: "()",
            caption: "Contains"
          }
        ]
      }
  ];
  
  export const groups = [
    {
      name: "and",
      caption: "And"
    },
    {
      name: "or",
      caption: "Or"
    }
  ];
  
  export const filterValue = {
    groupName: "and",
    items: [
      {
        key: "1",
        field: "tweet",
        operator: "()",
        value: "narcos"
      }
    ]
  };
  