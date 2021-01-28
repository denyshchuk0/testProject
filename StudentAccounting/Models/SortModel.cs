using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Models
{
    public enum SortState
    {
        NameAsc,    
        NameDesc, 
        SurnameAsc,    
        SurnameDesc,   
        AgeAsc, 
        AgeDesc,   
        EmailAsc, 
        EmailDesc,
        RegisteredDateAsc,
        RegisteredDateDesc
    }
    public class SortModel
    {
        public SortState NameSort { get; private set; }
        public SortState SurnameSort { get; private set; }
        public SortState AgeSort { get; private set; }   
        public SortState EmailSort { get; private set; }  
        public SortState RegisteredDateSort { get; private set; }   
        public SortState Current { get; private set; }   

        public SortModel(string sortOrder)
        {
            //NameSort = sortOrder == SortState.NameAsc ? SortState.NameDesc : SortState.NameAsc;
            //SurnameSort = sortOrder == SortState.SurnameAsc ? SortState.SurnameDesc : SortState.SurnameAsc;
            //AgeSort = sortOrder == SortState.AgeAsc ? SortState.AgeDesc : SortState.AgeAsc;
            //EmailSort = sortOrder == SortState.EmailAsc ? SortState.EmailDesc : SortState.EmailAsc;
            //RegisteredDateSort = sortOrder == SortState.RegisteredDateAsc ? SortState.RegisteredDateDesc : SortState.RegisteredDateAsc;

            //Current = sortOrder;
        }
    }
}
