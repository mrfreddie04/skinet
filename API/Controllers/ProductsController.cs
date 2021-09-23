using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using API.Dtos;
using API.Errors;
using Microsoft.AspNetCore.Http;
using API.Helpers;
using System;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;

        public ProductsController(            
            IGenericRepository<Product> productsRepo,
            IGenericRepository<ProductBrand> productBrandRepo,
            IGenericRepository<ProductType> productTypeRepo,
            IMapper mapper
        )
        {
            Console.WriteLine($"Product Controller Constructor");
            _productsRepo = productsRepo;
            _productBrandRepo = productBrandRepo;
            _productTypeRepo = productTypeRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductReadDto>>> GetProducts([FromQuery] ProductSpecParams productParams)
        {
            var specs = new ProductsWithTypesAndBrandsSpecification(productParams);
            var countSpecs = new ProductsWithFiltersForCountSpecification(productParams);
            var products = await _productsRepo.ListAsync(specs);
            var totalItems = await _productsRepo.CountAsync(countSpecs);

            // return Ok(products.Select( 
            //     product => _mapper.Map<Product, ProductReadDto>(product)
            // ));
            var pagination = new Pagination<ProductReadDto>
            (
                productParams.PageIndex,
                productParams.PageSize,
                totalItems ,
                _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductReadDto>>(products)
            );

            return Ok(pagination);            
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductReadDto>> GetProduct(int id) 
        {
            var specs = new ProductsWithTypesAndBrandsSpecification(id);            
            var product = await _productsRepo.GetEntityWithSpec(specs);

            if(product == null)
                return NotFound(new ApiResponse(404));

            var productReadDto = _mapper.Map<Product, ProductReadDto>(product);

            return Ok(productReadDto);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands() 
        {
            var brands = await _productBrandRepo.ListAllAsync();

            return Ok(brands);
        }        

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes() 
        {
            var types = await _productTypeRepo.ListAllAsync();

            return Ok(types);
        }           
    }            
}