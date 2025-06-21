CREATE MIGRATION m1w3bluuspdcp6ik37yz5r5gysdrtbqe5jkhsftjod4gvh5qw6dyaa
    ONTO m1i4zkvlxklsox54mqo5i4bai7k3uvwhb335jz6rggpdlpptlraelq
{
  CREATE TYPE default::User {
      CREATE PROPERTY address: std::str;
      CREATE PROPERTY city: std::str;
      CREATE REQUIRED PROPERTY email: std::str;
      CREATE REQUIRED PROPERTY username: std::str;
  };
};
