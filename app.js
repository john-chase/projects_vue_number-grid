const app = Vue.createApp({
    data() {
      return {
        //array of number objects
        gridNum: []
      };
    },
    methods: { 
      initGrid() {
        //populate grid with loop at creation
        let grid=new Array(100)
        for(let i=1;i<=100;i++) {
          grid[i-1] = { 'id': i, 'hilite': false}
        }
        console.table(grid)
        this.gridNum = grid
      },
      //prepare grid for next operation
      reset() {
        for(num in this.gridNum) {
          let currentNum=parseInt(num)
          this.gridNum[num].id=currentNum+1 //make sure the id isnt a string from ordinalizing      
          this.gridNum[num].hilite=false //reset hilighted items     
        }
        console.table(this.gridNum[num].id)
      },
      //return prime numbers from 1 to num
      getPrimes: (num)=>Array(num-1).fill().map((e,i)=>2+i).filter((e,i,a)=>a.slice(0,i).every(x=>e%x!==0)),
      showPrimes() {
        //highlight prime numbers
        this.reset()
        // console.log(this.getPrimes(100))
        const primes = this.getPrimes(100)
        for(num in this.gridNum) {
          if(primes.includes(this.gridNum[num].id)) {
            this.gridNum[num].hilite=true
          } else {
            this.gridNum[num].hilite=false
          }
        }
      },
      showOrdinals() {
        //modify numbers to display ordinals
        this.reset()
        for(num in this.gridNum) {
          if([0,4,5,6,7,8,9,11,12,13].includes(this.gridNum[num].id %10)) {
            this.gridNum[num].id+='th'
          } else if(this.gridNum[num].id %10 === 1) {
            this.gridNum[num].id+='st'
          } else if(this.gridNum[num].id %10 === 2) {
           this.gridNum[num].id+='nd'
          } else if(this.gridNum[num].id %10 === 3) {
            this.gridNum[num].id+='rd'
          }
        }
      },
      showFibos(num) {
        // The next number is found by adding up the two numbers before it:
        // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
        this.reset()        
        let a = 1, b = 0, temp;
        while (num >= 0){
          temp = a;
          a = a + b;
          b = temp;
          num--;
          console.log(b+"\n");
          this.gridNum[b-1].hilite=true
        }
      },
      showRoman() {
        // Display the number in roman format I, II, III, etc
        this.reset()        
        for(num in this.gridNum) {
          currentNum = this.gridNum[num].id
          roman=''
          if(currentNum <= 39) {
            if(currentNum.toString().length===2) {
              roman+="X".repeat(currentNum/10)
            }
          } else if(currentNum >= 40 && currentNum <= 49) {
            roman+="XL"          
          } else if(currentNum >= 50 && currentNum <= 89) {
            roman+="L"    
            roman+="X".repeat((currentNum/10)-5)      
          } else if(currentNum >= 90 && currentNum <= 99) {
            roman+="XC"    
          } else if(currentNum === 100) {
            roman+="C"
          }         
          switch(currentNum % 10) {
            case 1: roman+="I"
            break;
            case 2: roman+="II"
            break;
            case 3: roman+="III"
            break;
            case 4: roman+="IV"
            break;
            case 5: roman+="V"
            break;
            case 6: roman+="VI"
            break;
            case 7: roman+="VII"
            break;
            case 8: roman+="VIII"
            break;
            case 9: roman+="IX"
            break;
          }
          console.log(currentNum+"="+roman+"\n")
          this.gridNum[num].id=roman
        }
      }      
    },
    created() {
      this.initGrid();
    }
  });
  app.config.productionTip = false
  app.mount('#grid');