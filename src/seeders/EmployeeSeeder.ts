// import EmployeeModel from '@/models/Employee.mdl';
// import { faker } from '@faker-js/faker/locale/fa';
// import { faker as faker_en } from '@faker-js/faker/locale/en';

// export default class EmployeeSeeder {

//     static async createEmployee() {

//         let employee = new EmployeeModel({

//             profile_id: 1,
//             kode_meli: faker.datatype.number({ min: 1000000000, max: 9999999999 }).toString(),
//             username: faker_en.name.lastName().toLowerCase(),
//             firstName: faker.name.firstName(),
//             lastName: faker.name.lastName(),
//             sherkat_id: 1,
//             edareh_id: 1,
//         });

//         employee = await employee.save();

//         return employee;
//     }
// }