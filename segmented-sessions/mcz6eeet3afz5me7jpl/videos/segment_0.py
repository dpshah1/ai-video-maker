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
        self.wait(0.5)

        # Create a fraction representation
        fraction_text = Text("1/2", font_size=48).next_to(whole_circle, DOWN)
        self.play(Write(fraction_text))
        self.wait(0.5)

        # Create a shaded area to represent the fraction
        shaded_area = AnnularSector(inner_radius=0, outer_radius=2, angle=PI, color=YELLOW, fill_opacity=0.5)
        self.play(Create(shaded_area))
        self.wait(1)

        # Add a label for the shaded area
        shaded_label = Text("This is 1/2", font_size=36).next_to(shaded_area, RIGHT)
        self.play(Write(shaded_label))
        self.wait(1)

        # Fade out everything
        self.play(FadeOut(title), FadeOut(whole_circle), FadeOut(fraction_text), FadeOut(shaded_area), FadeOut(shaded_label))
        self.wait(1.5)  # Ensure the total duration is 8 seconds
```