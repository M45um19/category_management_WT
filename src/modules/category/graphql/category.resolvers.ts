export const resolvers = {
  Category: {
    parent: (category: any) => category.parent,

    children: async (category: any, _: any, { service }: any) => {
      if (!category._id) return [];
      return service.getChildrens(category._id);
    }
  },

  Query: {
    category: async (_: any, args: any, { service }: any) => {
      return service.getCategory(args);
    },

    categories: async (_: any, __: any, { service }: any) => {
      return service.getAllCategories();
    },


    children: async (_: any, args: any, { service }: any) => {
      return service.getChildrens(args.parentId);
    }
  }
};