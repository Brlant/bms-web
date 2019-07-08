import {http} from '../resources';

/**
 * Custom validators for VeeValidate
 * @author backflow hunan_me@163.com
 */
export default {

  //  Server side validation
  remote: {
    getMessage: (field) => `${field} already exists or it's not valid.`,
    //  If you want to return a promise you will have to make sure it always resolves
    //  to an object containing a 'valid' property which is a boolean state of the validation.
    validate(val, args, field) {
      return http.get(args[0], {
        params: {
          [field]: val
        }
      }).then(response => response.data);
    }
  },

  unique: {
    getMessage: (field) => `${field} must be unique.`,
    //  If you want to return a promise you will have to make sure it always resolves
    //  to an object containing a 'valid' property which is a boolean state of the validation.
    validate: () => {
      return false;
    }
  }
};
