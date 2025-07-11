```python
from manim import *

class EducationalAnimation(Scene):
    def construct(self):
        # Create a title
        title = Text("Understanding Fractions", font_size=72)
        self.play(Write(title))
        self.wait(1)

        # Create a circle to represent a whole
        whole_circle = Circle(radius=2, color=BLUE)
        self.play(Create(whole_circle))
        self.wait(1)

        # Create a sector to represent a fraction
        fraction_sector = Sector(radius=2, angle=PI / 3, color=YELLOW)
        self.play(Create(fraction_sector))
        self.wait(1)

        # Add a label for the fraction
        fraction_label = Text(r"$\frac{1}{3}$", font_size=48).move_to(fraction_sector.get_center())
        self.play(Write(fraction_label))
        self.wait(1)

        # Fade out everything
        self.play(FadeOut(title), FadeOut(whole_circle), FadeOut(fraction_sector), FadeOut(fraction_label))
        self.wait(1)

        # End the scene
        self.wait(1)
```