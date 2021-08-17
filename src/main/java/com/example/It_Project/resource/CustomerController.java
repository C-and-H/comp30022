package com.example.It_Project.resource;

import com.example.It_Project.model.Customer;
import com.example.It_Project.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
public class CustomerController {
    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("addCustomer")
    public String saveCustomer(@RequestBody Customer customer){
        customerRepository.save(customer);
        return "Add customer with name " + customer.getName();
    }

    @GetMapping("findAllCustomers")
    public List<Customer> getCustomers(){
        return customerRepository.findAll();
    }

    // find all the customer
    @GetMapping("findAllCustomers/{id}")
    public Customer getOneCustomer(@PathVariable String id){
        return customerRepository.findById(id).orElseGet(Customer::new);
    }

    @GetMapping("delete/{id}")
    public String deleteCustomer(@PathVariable String id){

        Optional<Customer> customer = customerRepository.findById(id);
        if(customer != null){
            return customer.get().getName();
        }
        customerRepository.deleteById(id);
        return "customer is deleted with name " + id;
    }


}