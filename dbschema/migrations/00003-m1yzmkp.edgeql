CREATE MIGRATION m1yzmkpioteg5kh5ibduy6jdnno5iqxvyel72bhkazohtuzkhebz6a
    ONTO m1w3bluuspdcp6ik37yz5r5gysdrtbqe5jkhsftjod4gvh5qw6dyaa
{
  CREATE TYPE default::Asset {
      CREATE OPTIONAL PROPERTY location: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY serial_number: std::str;
      CREATE REQUIRED PROPERTY type: std::str;
      CREATE OPTIONAL PROPERTY user: std::str;
  };
};
